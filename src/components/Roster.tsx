"use client";

import React, { useState, useEffect } from 'react';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLocalStorage from '@/hooks/useLocalStorage';
import { capitalizeName } from '@/utils';
import { validateName, validateRating, validatePosition } from '@/utils/validationUtils';
import { toast } from 'react-hot-toast';
import RosterImageUpload from './RosterImageUpload';
import { positions } from '@/types/playerTypes';

interface Player {
  id: number;
  jerseyNumber: string; // New field
  name: string;
  position: string;
  year: string;
  rating: string;
  devTrait: 'Normal' | 'Impact' | 'Star' | 'Elite';
  notes: string;
}

const years = ['FR', 'FR (RS)', 'SO', 'SO (RS)', 'JR', 'JR (RS)', 'SR', 'SR (RS)'];
const devTraits = ['Normal', 'Impact', 'Star', 'Elite'] as const;

type SortField = 'jerseyNumber' | 'name' | 'position' | 'year' | 'rating' | 'devTrait';

const yearOrder: { [key: string]: number } = {
  'FR': 0, 'FR (RS)': 1, 'SO': 2, 'SO (RS)': 3, 'JR': 4, 'JR (RS)': 5, 'SR': 6, 'SR (RS)': 7
};

const devTraitOrder: { [key: string]: number } = {
  'Normal': 0, 'Impact': 1, 'Star': 2, 'Elite': 3
};

const Roster: React.FC = () => {
  const [players, setPlayers] = useLocalStorage<Player[]>('players', []);
  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id'>>({ jerseyNumber: '', name: '', position: '', year: '', rating: '', devTrait: 'Normal', notes: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: 'asc' | 'desc' }>({ field: 'rating', direction: 'desc' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setSortConfig({ field: 'rating', direction: 'desc' });
  }, [players]);

  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortConfig.field === 'jerseyNumber') {
      return sortConfig.direction === 'asc'
        ? a.jerseyNumber.localeCompare(b.jerseyNumber, undefined, {numeric: true})
        : b.jerseyNumber.localeCompare(a.jerseyNumber, undefined, {numeric: true});
    }
    if (sortConfig.field === 'year') {
      const yearDiff = yearOrder[a.year] - yearOrder[b.year];
      return sortConfig.direction === 'asc' ? yearDiff : -yearDiff;
    } else if (sortConfig.field === 'rating') {
      return sortConfig.direction === 'asc'
        ? parseInt(a.rating) - parseInt(b.rating)
        : parseInt(b.rating) - parseInt(a.rating);
    } else if (sortConfig.field === 'devTrait') {
      const traitDiff = devTraitOrder[a.devTrait] - devTraitOrder[b.devTrait];
      return sortConfig.direction === 'asc' ? traitDiff : -traitDiff;
    } else {
      if (a[sortConfig.field] < b[sortConfig.field]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.field] > b[sortConfig.field]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
  });

  const requestSort = (field: SortField) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const addPlayer = () => {
    if (validatePlayer(newPlayer)) {
      try {
        setPlayers([...players, { ...newPlayer, id: Date.now(), name: capitalizeName(newPlayer.name) }]);
        setNewPlayer({ jerseyNumber: '', name: '', position: '', year: '', rating: '', devTrait: 'Normal', notes: '' });
        toast.success('Player added successfully!');
      } catch (error) {
        console.error('Error adding player:', error);
        toast.error('Failed to add player. Please try again.');
      }
    } else {
      toast.error('Please correct the errors before adding the player.');
    }
  };

  const updatePlayer = (index: number, field: keyof Player, value: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };

    if (validatePlayer(updatedPlayers[index])) {
      try {
        setPlayers(updatedPlayers);
        toast.success('Player updated successfully!');
      } catch (error) {
        console.error('Error updating player:', error);
        toast.error('Failed to update player. Please try again.');
      }
    } else {
      toast.error('Please correct the errors before updating the player.');
    }
  };

  const startEditing = (player: Player) => {
    setEditingId(player.id);
    setNewPlayer(player);
  };

  const saveEdit = () => {
    setPlayers(players.map(player =>
      player.id === editingId
        ? { ...newPlayer, id: player.id, name: capitalizeName(newPlayer.name) }
        : player
    ));
    setEditingId(null);
    setNewPlayer({jerseyNumber: '', name: '', position: '', year: '', rating: '', devTrait: 'Normal', notes: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewPlayer({ jerseyNumber : '', name: '', position: '', year: '', rating: '', devTrait: 'Normal', notes: '' });
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const validatePlayer = (player: Omit<Player, 'id'>): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!player.jerseyNumber.trim()) {
      newErrors.jerseyNumber = 'Jersey number is required.';
    }

    if (!validateName(player.name)) {
      newErrors.name = 'Invalid name. Please enter a non-empty name up to 100 characters.';
    }
    if (!validatePosition(player.position)) {
      newErrors.position = 'Invalid position. Please select a valid position.';
    }
    if (!validateRating(player.rating)) {
      newErrors.rating = 'Invalid rating. Please enter a number between 0 and 99.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProcessComplete = (newPlayers: Omit<Player, 'id' | 'devTrait' | 'notes' | 'jerseyNumber'>[]) => {
    const playersWithIds = newPlayers.map(player => ({
      ...player,
      id: Date.now() + Math.random(),
      jerseyNumber: '', // Default empty string for jersey number
      devTrait: 'Normal' as const,
      notes: ''
    }));
    setPlayers(prevPlayers => [...prevPlayers, ...playersWithIds]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Roster</h1>

      <RosterImageUpload onProcessComplete={handleProcessComplete} />

      <Card>
        <CardHeader className="text-xl font-semibold">
          {editingId ? 'Edit Player' : 'Add New Player'}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
            <Input
              value={newPlayer.jerseyNumber}
              onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })}
              placeholder="Jersey #"
              className={errors.jerseyNumber ? 'border-red-500' : ''}
            />
            <Input
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
              placeholder="Name"
              className={errors.name ? 'border-red-500' : ''}
            />
            <Select
              value={newPlayer.position}
              onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map(pos => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={newPlayer.year}
              onValueChange={(value) => setNewPlayer({ ...newPlayer, year: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={newPlayer.rating}
              onChange={(e) => setNewPlayer({ ...newPlayer, rating: e.target.value })}
              placeholder="Overall"
              className={errors.rating ? 'border-red-500' : ''}
            />
            <Select
              value={newPlayer.devTrait}
              onValueChange={(value) => setNewPlayer({ ...newPlayer, devTrait: value as Player['devTrait'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dev Trait" />
              </SelectTrigger>
              <SelectContent>
                {devTraits.map(trait => (
                  <SelectItem key={trait} value={trait}>{trait}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={newPlayer.notes}
              onChange={(e) => setNewPlayer({ ...newPlayer, notes: e.target.value })}
              placeholder="Notes"
            />
            {editingId ? (
              <div className="flex space-x-2">
                <Button onClick={saveEdit}>Save</Button>
                <Button onClick={cancelEdit} variant="outline">Cancel</Button>
              </div>
            ) : (
              <Button onClick={addPlayer}>Add Player</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-xl font-semibold">Current Roster</CardHeader>
        <CardContent>
          <Table>
            <thead>
              <tr>
                {['Jersey #', 'Name', 'Position', 'Year', 'Rating', 'Dev. Trait', 'Notes', 'Actions'].map((header, index) => (
                  <th
                    key={header}
                    className={`text-center cursor-pointer table-hover-cell ${hoveredColumn === index ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                    onClick={() => requestSort(header.toLowerCase() as SortField)}
                    onMouseEnter={() => setHoveredColumn(index)}
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    {header} {sortConfig.field === header.toLowerCase() && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map(player => (
                <tr key={player.id} className="table-hover-row">
                  <td className={`text-center table-hover-cell ${hoveredColumn === 0 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>{player.jerseyNumber}</td>
                  <td className={`text-center table-hover-cell ${hoveredColumn === 1 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>{player.name}</td>
                  <td className={`text-center table-hover-cell ${hoveredColumn === 2 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>{player.position}</td>
                  <td className={`text-center table-hover-cell ${hoveredColumn === 3 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>{player.year}</td>
                  <td className={`text-center table-hover-cell ${hoveredColumn === 4 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>{player.rating}</td>
                  <td className={`text-center table-hover-cell ${hoveredColumn === 5 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>{player.devTrait || 'Normal'}</td>
                  <td className={`text-center table-hover-cell ${hoveredColumn === 6 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>{player.notes}</td>
                  <td className={`text-center table-hover-cell ${hoveredColumn === 7 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
                    <div className="flex justify-center space-x-2">
                      <Button onClick={() => startEditing(player)} size="sm">Edit</Button>
                      <Button onClick={() => removePlayer(player.id)} variant="destructive" size="sm">Remove</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Roster;