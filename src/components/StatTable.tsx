// src/components/StatTable.tsx
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlayerStat, ViewType, StatCategory } from './PlayerStats';

interface StatTableProps {
  category: StatCategory;
  viewType: ViewType;
  stats: PlayerStat[];
  onAddStat: (stat: Omit<PlayerStat, 'id'>) => void;
  onUpdateStat: (id: string, stat: Partial<PlayerStat>) => void;
  onDeleteStat: (id: string) => void;
}

const statFields: { [key in StatCategory]: string[] } = {
  Passing: ['Attempts', 'Completions', 'Yards', 'Touchdowns', 'Interceptions'],
  Rushing: ['Attempts', 'Yards', 'Touchdowns', 'Fumbles'],
  Receiving: ['Receptions', 'Yards', 'Touchdowns', 'Fumbles'],
  Blocking: ['Pancakes', 'Sacks Allowed'],
  Defense: ['Tackles', 'Sacks', 'Interceptions', 'Forced Fumbles', 'Fumble Recoveries'],
  Kicking: ['Field Goals Made', 'Field Goals Attempted', 'Extra Points Made', 'Extra Points Attempted'],
  Punting: ['Punts', 'Yards', 'Inside 20'],
  'Kick Return': ['Returns', 'Yards', 'Touchdowns'],
  'Punt Return': ['Returns', 'Yards', 'Touchdowns']
};

const StatTable: React.FC<StatTableProps> = ({ category, viewType, stats, onAddStat, onUpdateStat, onDeleteStat }) => {
  const [newStat, setNewStat] = useState<Omit<PlayerStat, 'id'>>({
    name: '',
    year: new Date().getFullYear(),
    category: category,
  });

  const handleAddStat = () => {
    if (newStat.name) {
      onAddStat(newStat);
      setNewStat({
        name: '',
        year: new Date().getFullYear(),
        category: category,
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          {viewType !== 'Game' && <TableHead>Year</TableHead>}
          {statFields[category].map(field => (
            <TableHead key={field}>{field}</TableHead>
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map(stat => (
          <TableRow key={stat.id}>
            <TableCell>{stat.name}</TableCell>
            {viewType !== 'Game' && <TableCell>{stat.year}</TableCell>}
            {statFields[category].map(field => (
              <TableCell key={field}>
                <Input
                  type="number"
                  value={stat[field]?.toString() || ''}
                  onChange={(e) => onUpdateStat(stat.id, { [field]: parseFloat(e.target.value) || 0 })}
                />
              </TableCell>
            ))}
            <TableCell>
              <Button onClick={() => onDeleteStat(stat.id)} variant="destructive" size="sm">Delete</Button>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell>
            <Input
              value={newStat.name}
              onChange={(e) => setNewStat({ ...newStat, name: e.target.value })}
              placeholder="New player"
            />
          </TableCell>
          {viewType !== 'Game' && (
            <TableCell>
              <Input
                type="number"
                value={newStat.year.toString()}
                onChange={(e) => setNewStat({ ...newStat, year: parseInt(e.target.value) || new Date().getFullYear() })}
                placeholder="Year"
              />
            </TableCell>
          )}
          {statFields[category].map(field => (
            <TableCell key={field}>
              <Input
                type="number"
                value={newStat[field]?.toString() || ''}
                onChange={(e) => setNewStat({ ...newStat, [field]: parseFloat(e.target.value) || 0 })}
                placeholder={field}
              />
            </TableCell>
          ))}
          <TableCell>
            <Button onClick={handleAddStat} size="sm">Add</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default StatTable;