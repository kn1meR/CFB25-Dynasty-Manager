"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  getCurrentYear, 
  setCurrentYear, 
  getSchedule, 
  setSchedule, 
  setYearStats, 
  calculateStats,
  Game, 
  YearStats
} from '@/utils/localStorage';

const results = ['Win', 'Loss', 'Tie', 'Bye', 'N/A'] as const;

const TeamHome: React.FC = () => {
  const router = useRouter();
  const [currentYear, setYear] = useState<number>(getCurrentYear());
  const [currentSchedule, setCurrentSchedule] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRecord, setCurrentRecord] = useState({ wins: 0, losses: 0, ties: 0 });

  useEffect(() => {
    const year = getCurrentYear();
    setYear(year);
    const schedule = getSchedule(year);
    if (schedule.length === 0) {
      const newSchedule = Array.from({ length: 19 }, (_, i) => ({ 
        id: i, 
        week: i, 
        opponent: '', 
        result: 'N/A', 
        score: '' 
      }));
      setSchedule(year, newSchedule);
      setCurrentSchedule(newSchedule);
    } else {
      // Ensure the schedule has 19 weeks
      const updatedSchedule = Array.from({ length: 19 }, (_, i) => {
        const existingGame = schedule.find(game => game.week === i);
        return existingGame || { id: i, week: i, opponent: '', result: 'N/A', score: '' };
      });
      setCurrentSchedule(updatedSchedule);
      setSchedule(year, updatedSchedule);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const record = currentSchedule.reduce(
      (acc, game) => {
        if (game.result === 'Win') acc.wins++;
        else if (game.result === 'Loss') acc.losses++;
        else if (game.result === 'Tie') acc.ties++;
        return acc;
      },
      { wins: 0, losses: 0, ties: 0 }
    );
    setCurrentRecord(record);
  }, [currentSchedule]);

  const updateSchedule = (week: number, field: keyof Game, value: string) => {
    setCurrentSchedule(prevSchedule => {
      const updatedSchedule = prevSchedule.map(game => 
        game.week === week ? { ...game, [field]: value } : game
      );
      setSchedule(currentYear, updatedSchedule);
      return updatedSchedule;
    });
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Win':
        return 'bg-green-200 dark:bg-green-800';
      case 'Loss':
        return 'bg-red-200 dark:bg-red-800';
      case 'Bye':
        return 'bg-gray-100 dark:bg-gray-700';
      default:
        return '';
    }
  };

  const calculateTotalPoints = (schedule: Game[]): { pointsFor: number, pointsAgainst: number } => {
    return schedule.reduce((totals, game) => {
      if (game.score) {
        const [teamScore, opponentScore] = game.score.split('-').map(Number);
        if (!isNaN(teamScore) && !isNaN(opponentScore)) {
          totals.pointsFor += teamScore;
          totals.pointsAgainst += opponentScore;
        }
      }
      return totals;
    }, { pointsFor: 0, pointsAgainst: 0 });
  };

  const endYear = () => {
    // Save current year's schedule and stats
    setSchedule(currentYear, currentSchedule);
    const calculatedStats = calculateStats(currentSchedule);
    const { pointsFor, pointsAgainst } = calculateTotalPoints(currentSchedule);
    const fullStats: YearStats = {
      wins: calculatedStats.wins ?? 0,
      losses: calculatedStats.losses ?? 0,
      conferenceWins: 0, // You might want to calculate these based on your conference games
      conferenceLosses: 0,
      pointsScored: pointsFor,
      pointsAgainst: pointsAgainst,
      playersDrafted: 0,
      conferenceStanding: '',
      bowlGame: '',
      bowlResult: '',
    };
    setYearStats(currentYear, fullStats);
  
    // Save the schedule to the year record
    const storedRecords = localStorage.getItem('yearRecords');
    let records = storedRecords ? JSON.parse(storedRecords) : [];
    const record = {
      year: currentYear,
      overallRecord: `${fullStats.wins}-${fullStats.losses}`,
      conferenceRecord: `${fullStats.conferenceWins}-${fullStats.conferenceLosses}`,
      bowlGame: fullStats.bowlGame,
      bowlResult: fullStats.bowlResult,
      schedule: currentSchedule,
      pointsFor: pointsFor,
      pointsAgainst: pointsAgainst,
    };
    const existingRecordIndex = records.findIndex((r: any) => r.year === currentYear);
    if (existingRecordIndex !== -1) {
      records[existingRecordIndex] = record;
    } else {
      records.push(record);
    }
    localStorage.setItem('yearRecords', JSON.stringify(records));

    // Move to next year
    const newYear = currentYear + 1;
    setYear(newYear);
    setCurrentYear(newYear);
    
    // Reset schedule for new year
    const newSchedule = Array.from({ length: 19 }, (_, i) => ({ 
      id: i, 
      week: i, // This will create weeks 0 to 18
      opponent: '', 
      result: 'N/A', 
      score: '' 
    }));
    setCurrentSchedule(newSchedule);
    setSchedule(newYear, newSchedule);
  
    router.refresh();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Team Home - {currentYear}</h1>
      
      <Card>
        <CardHeader className="text-xl text-center font-semibold">Current Record</CardHeader>
        <CardContent>
          <p className="text-center text-2xl font-bold">
            {currentRecord.wins} - {currentRecord.losses}
            {currentRecord.ties > 0 ? ` - ${currentRecord.ties}` : ''}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="text-xl font-semibold"> {currentYear} Schedule |  {currentRecord.wins} - {currentRecord.losses} {currentRecord.ties > 0 ? ` - ${currentRecord.ties}` : ''}
          </CardHeader>
        <CardContent>
          <Table>
            <thead>
              <tr>
                <th className="text-center w-1/12">Week</th>
                <th className="text-center w-1/3">Opponent</th>
                <th className="text-center w-1/6">Result</th>
                <th className="text-center w-1/4">Score</th>
              </tr>
            </thead>
            <tbody>
              {currentSchedule.map(game => (
                <tr key={game.week}>
                  <td className="text-center">
                    {game.week === 0 ? 'Week 0' : `Week ${game.week}`}
                  </td>
                  <td className="text-center">
                    <Input
                      value={game.opponent}
                      onChange={(e) => updateSchedule(game.week, 'opponent', e.target.value)}
                      placeholder="Enter opponent"
                      className="w-full text-center"
                    />
                  </td>
                  <td className={`text-center ${getResultColor(game.result)}`}>
                    <Select
                      value={game.result}
                      onValueChange={(value) => updateSchedule(game.week, 'result', value)}
                    >
                      <SelectTrigger className="w-full text-center">
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        {results.map(result => (
                          <SelectItem key={result} value={result}>
                            {result === 'N/A' ? 'Not Played' : result}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="text-center">
                    <Input
                      value={game.score}
                      onChange={(e) => updateSchedule(game.week, 'score', e.target.value)}
                      placeholder="Enter score"
                      className="w-full text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="px-8 py-4 text-lg">End Year</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to end the year?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will save the current year's schedule and results, and start a new year. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={endYear}>End Year</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default TeamHome;