"use client";

import React, { useState } from 'react';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface Player {
  id: number;
  name: string;
  position: string;
  year: string;
  rating: string;
}

interface TeamStats {
  wins: number;
  losses: number;
  conference: string;
}

const CollegeFootballDynastyManager: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id'>>({ name: '', position: '', year: '', rating: '' });
  const [teamStats, setTeamStats] = useState<TeamStats>({ wins: 0, losses: 0, conference: '' });

  const addPlayer = () => {
    setPlayers([...players, { ...newPlayer, id: Date.now() }]);
    setNewPlayer({ name: '', position: '', year: '', rating: '' });
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const updateTeamStats = (stat: keyof TeamStats, value: string) => {
    setTeamStats({ ...teamStats, [stat]: stat === 'conference' ? value : Number(value) });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CFB25 Dynasty Manager</h1>
      
      <Card className="mb-4">
        <CardHeader>Team Statistics</CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              type="number" 
              value={teamStats.wins} 
              onChange={(e) => updateTeamStats('wins', e.target.value)} 
              placeholder="Wins"
            />
            <Input 
              type="number" 
              value={teamStats.losses} 
              onChange={(e) => updateTeamStats('losses', e.target.value)} 
              placeholder="Losses"
            />
            <Input 
              value={teamStats.conference} 
              onChange={(e) => updateTeamStats('conference', e.target.value)} 
              placeholder="Conference"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>Add New Player</CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-2">
            <Input 
              value={newPlayer.name} 
              onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})} 
              placeholder="Name"
            />
            <Input 
              value={newPlayer.position} 
              onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})} 
              placeholder="Position"
            />
            <Input 
              value={newPlayer.year} 
              onChange={(e) => setNewPlayer({...newPlayer, year: e.target.value})} 
              placeholder="Year"
            />
            <Input 
              value={newPlayer.rating} 
              onChange={(e) => setNewPlayer({...newPlayer, rating: e.target.value})} 
              placeholder="Rating"
            />
          </div>
          <Button onClick={addPlayer}>Add Player</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Roster</CardHeader>
        <CardContent>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Year</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {players.map(player => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{player.position}</td>
                  <td>{player.year}</td>
                  <td>{player.rating}</td>
                  <td>
                    <Button onClick={() => removePlayer(player.id)} variant="destructive">Remove</Button>
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

export default CollegeFootballDynastyManager;