"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { capitalizeName } from '@/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Award {
  id: number;
  playerName: string;
  awardName: string;
  year: number;
}

const AwardTracker: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('currentYear') || new Date().getFullYear().toString(), 10);
    }
    return new Date().getFullYear();
  });
  const [allAwards, setAllAwards] = useState<Award[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('allAwards') || '[]');
    }
    return [];
  });
  const [newAward, setNewAward] = useState<Omit<Award, 'id' | 'year'>>({ playerName: '', awardName: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    localStorage.setItem('allAwards', JSON.stringify(allAwards));
  }, [allAwards]);

  const awardsForSelectedYear = allAwards.filter(award => award.year === selectedYear);

  const addAward = () => {
    setAllAwards([...allAwards, {
      ...newAward,
      id: Date.now(),
      year: selectedYear,
      playerName: capitalizeName(newAward.playerName)
    }]);
    setNewAward({ playerName: '', awardName: '' });
  };

  const startEditing = (award: Award) => {
    setEditingId(award.id);
    setNewAward(award);
  };

  const saveEdit = () => {
    setAllAwards(allAwards.map(award =>
      award.id === editingId
        ? { ...newAward, id: award.id, year: selectedYear, playerName: capitalizeName(newAward.playerName) }
        : award
    ));
    setEditingId(null);
    setNewAward({ playerName: '', awardName: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewAward({ playerName: '', awardName: '' });
  };

  const removeAward = (id: number) => {
    setAllAwards(allAwards.filter(award => award.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Award Tracker</h1>

      <Card>
        <CardHeader className="text-xl font-semibold">
          <div className="flex justify-between items-center">
            <span>Add New Award for Year: {selectedYear}</span>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => currentYear + i).map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              value={newAward.playerName}
              onChange={(e) => setNewAward({ ...newAward, playerName: e.target.value })}
              placeholder="Player Name"
            />
            <Input
              value={newAward.awardName}
              onChange={(e) => setNewAward({ ...newAward, awardName: e.target.value })}
              placeholder="Award Name"
            />
            {editingId ? (
              <div className="flex space-x-2">
                <Button onClick={saveEdit}>Save</Button>
                <Button onClick={cancelEdit} variant="outline">Cancel</Button>
              </div>
            ) : (
              <Button onClick={addAward}>Add Award</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-xl font-semibold">
          <div className="flex justify-between items-center">
            <span>Awards for {selectedYear}</span>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <thead>
              <tr>
                <th className="text-center">Player Name</th>
                <th className="text-center">Award</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {awardsForSelectedYear.map(award => (
                <tr key={award.id}>
                  <td className="text-center">{award.playerName}</td>
                  <td className="text-center">{award.awardName}</td>
                  <td className="text-center">
                    <div className="flex justify-center space-x-2">
                      <Button onClick={() => startEditing(award)} size="sm">Edit</Button>
                      <Button onClick={() => removeAward(award.id)} variant="destructive" size="sm">Remove</Button>
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

export default AwardTracker;