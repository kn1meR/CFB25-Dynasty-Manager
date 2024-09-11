// src/components/PlayerStats.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useLocalStorage from '@/hooks/useLocalStorage';

type StatCategory = 'Passing' | 'Rushing' | 'Receiving' | 'Blocking' | 'Defense' | 'Kicking' | 'Punting' | 'Kick Return' | 'Punt Return';
type ViewType = 'Game' | 'Season' | 'Career';
type TimeFrame = 'Current Season' | 'Past Seasons' | 'Overall';

interface PlayerStat {
  id: string;
  name: string;
  year: number;
  position: string;
  // Passing
  passYards: number;
  passTD: number;
  passAttempts: number;
  passCompletions: number;
  passInterceptions: number;
  // Rushing
  rushYards: number;
  rushTD: number;
  rushAttempts: number;
  // Receiving
  receptions: number;
  recYards: number;
  recTD: number;
  // Blocking
  pancakes: number;
  sacksAllowed: number;
  // Defense
  tackles: number;
  tacklesForLoss: number;
  Sacks: number;
  interceptions: number;
  forcedFumbles: number;
  // Kicking
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  extraPointsMade: number;
  extraPointsAttempted: number;
  // Punting
  punts: number;
  puntYards: number;
  puntsInside20: number;
  // Kick Return
  kickReturns: number;
  kickReturnYards: number;
  kickReturnTD: number;
  // Punt Return
  puntReturns: number;
  puntReturnYards: number;
  puntReturnTD: number;
}

const statFields: Record<StatCategory, (keyof PlayerStat)[]> = {
  'Passing': ['passYards', 'passTD', 'passAttempts', 'passCompletions', 'passInterceptions'],
  'Rushing': ['rushYards', 'rushTD', 'rushAttempts'],
  'Receiving': ['receptions', 'recYards', 'recTD'],
  'Blocking': ['pancakes', 'sacksAllowed'],
  'Defense': ['tackles', 'tacklesForLoss', 'Sacks', 'interceptions', 'forcedFumbles'],
  'Kicking': ['fieldGoalsMade', 'fieldGoalsAttempted', 'extraPointsMade', 'extraPointsAttempted'],
  'Punting': ['punts', 'puntYards', 'puntsInside20'],
  'Kick Return': ['kickReturns', 'kickReturnYards', 'kickReturnTD'],
  'Punt Return': ['puntReturns', 'puntReturnYards', 'puntReturnTD'],
};

const initialPlayerStat: PlayerStat = {
  id: '',
  name: '',
  year: new Date().getFullYear(),
  position: '',
  passYards: 0, passTD: 0, passAttempts: 0, passCompletions: 0, passInterceptions: 0,
  rushYards: 0, rushTD: 0, rushAttempts: 0,
  receptions: 0, recYards: 0, recTD: 0,
  pancakes: 0, sacksAllowed: 0,
  tackles: 0, tacklesForLoss: 0, Sacks: 0, interceptions: 0, forcedFumbles: 0,
  fieldGoalsMade: 0, fieldGoalsAttempted: 0, extraPointsMade: 0, extraPointsAttempted: 0,
  punts: 0, puntYards: 0, puntsInside20: 0,
  kickReturns: 0, kickReturnYards: 0, kickReturnTD: 0,
  puntReturns: 0, puntReturnYards: 0, puntReturnTD: 0,
};

const PlayerStats: React.FC = () => {
  const [playerStats, setPlayerStats] = useLocalStorage<PlayerStat[]>('playerStats', []);
  const [category, setCategory] = useState<StatCategory>('Passing');
  const [viewType, setViewType] = useState<ViewType>('Season');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('Current Season');
  const [newStat, setNewStat] = useState<PlayerStat>(initialPlayerStat);
  const [editingId, setEditingId] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();

  const filteredAndSortedStats = useMemo(() => {
    let filtered = playerStats;

    if (timeFrame === 'Current Season') {
      filtered = filtered.filter(stat => stat.year === currentYear);
    } else if (timeFrame === 'Past Seasons') {
      filtered = filtered.filter(stat => stat.year < currentYear);
    }

    const sortField = statFields[category][0];
    return filtered
      .sort((a, b) => (b[sortField] as number) - (a[sortField] as number))
      .slice(0, 10);
  }, [playerStats, category, timeFrame, currentYear]);

  const handleInputChange = (field: keyof PlayerStat, value: string | number) => {
    setNewStat((prev: PlayerStat) => ({
      ...prev,
      [field]: field === 'name' || field === 'position' ? value : Number(value)
    }));
  };

  const handleSubmit = () => {
    if (editingId) {
      setPlayerStats((prev: PlayerStat[]) => 
        prev.map(stat => stat.id === editingId ? { ...newStat, id: editingId } : stat)
      );
      setEditingId(null);
    } else {
      setPlayerStats((prev: PlayerStat[]) => [...prev, { ...newStat, id: Date.now().toString() }]);
    }
    setNewStat(initialPlayerStat);
  };

  const startEditing = (stat: PlayerStat) => {
    setEditingId(stat.id);
    setNewStat(stat);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewStat(initialPlayerStat);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Player Stats</h1>

      <div className="flex justify-between">
        <Select value={category} onValueChange={(value) => setCategory(value as StatCategory)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(statFields).map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={viewType} onValueChange={(value) => setViewType(value as ViewType)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select view type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Game">Game</SelectItem>
            <SelectItem value="Season">Season</SelectItem>
            <SelectItem value="Career">Career</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Current Season">Current Season</SelectItem>
            <SelectItem value="Past Seasons">Past Seasons</SelectItem>
            <SelectItem value="Overall">Overall</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="text-xl font-semibold">Add/Edit Player Stats</CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <Input
              placeholder="Name"
              value={newStat.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <Input
              placeholder="Year"
              type="number"
              value={newStat.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
            />
            <Input
              placeholder="Position"
              value={newStat.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
            />
            {statFields[category].map((field) => (
              <Input
                key={field}
                placeholder={field}
                type="number"
                value={newStat[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Add'} Stat</Button>
            {editingId && <Button onClick={cancelEditing} variant="outline">Cancel</Button>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-xl font-semibold">{`Top 10 ${category} Stats (${viewType} - ${timeFrame})`}</CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                {statFields[category].map((field) => (
                  <TableHead key={field}>{field}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedStats.map(stat => (
                <TableRow key={stat.id}>
                  <TableCell>{stat.name}</TableCell>
                  <TableCell>{stat.position}</TableCell>
                  {statFields[category].map((field) => (
                    <TableCell key={field}>{stat[field]}</TableCell>
                  ))}
                  <TableCell>
                    <Button onClick={() => startEditing(stat)} size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerStats;
