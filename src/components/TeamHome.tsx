// src/components/TeamHome.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getCurrentYear, setCurrentYear, getSchedule, setSchedule, getYearStats, setYearStats, calculateStats, generateYearRecord, setYearRecord} from '@/utils/localStorage';
import { validateYear } from '@/utils/validationUtils';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Game, YearStats } from '@/types/yearRecord';

const TeamHome: React.FC = () => {
  const router = useRouter();
  const [currentYear, setYear] = useState<number>(getCurrentYear());
  const [currentSchedule, setCurrentSchedule] = useState<Game[]>([]);
  const [yearStats, setCurrentYearStats] = useState<YearStats>({
    wins: 0,
    losses: 0,
    conferenceWins: 0,
    conferenceLosses: 0,
    pointsScored: 0,
    pointsAgainst: 0,
    playersDrafted: 0,
    conferenceStanding: '',
    bowlGame: '',
    bowlResult: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      try {
        const year = getCurrentYear();
        setYear(year);
        const schedule = getSchedule(year);
        setCurrentSchedule(schedule);
        const stats = getYearStats(year);
        setCurrentYearStats(stats);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const endYear = () => {
    if(!validateYear(currentYear + 1)) {
      toast.error('Invalid next year. Please check year and try again')
      return;
    }

    try {
      // Save currentYear's schedules and stats
      setSchedule(currentYear, currentSchedule);
      const calculatedStats = calculateStats(currentSchedule);
      setYearStats(currentYear, calculatedStats);

      // Generate Year Record
      let yearRecord = generateYearRecord(currentYear, yearStats, currentSchedule);

      // Store Year Record
      setYearRecord(currentYear, yearRecord);

      // Move to next year
      const newYear = currentYear + 1;
      setYear(newYear);
      setCurrentYear(newYear);

      const newSchedule: Game[] = Array.from({ length:19 }, (_, i) => ({
        id: i,
        week: i,
        location: 'neutral',
        opponent: 'unselected',
        result: 'N/A',
        score: ''
      }));
      setCurrentSchedule(newSchedule);
      setSchedule(newYear, newSchedule);
      setCurrentYearStats({
        wins: 0,
        losses: 0,
        conferenceWins: 0,
        conferenceLosses: 0,
        pointsScored: 0,
        pointsAgainst: 0,
        playersDrafted: 0,
        conferenceStanding: '',
        bowlGame: '',
        bowlResult: '',
      });
    
      router.refresh();
      toast.success('Year ended successfully. Welcome to the new season!');
    } catch (error) {
      console.error('Error ending year:', error);
      toast.error('Failed to end the year. Please try again.');
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const recentGames = currentSchedule.filter(game => game.result !== 'N/A').slice(-5);
  const upcomingGames = currentSchedule.filter(game => game.result === 'N/A').slice(0, 5);

  const formatGameDisplay = (game: Game) => {
    switch (game.location) {
      case 'neutral':
        return `vs ${game.opponent} (Neutral)`;
      case '@':
        return `@ ${game.opponent}`;
      case 'vs':
        return `vs ${game.opponent}`;
        case ' ':
        return `BYE ${game.opponent}`;
      default:
        return game.opponent;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Team Dashboard - {currentYear}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-xl font-semibold text-center">Current Record</CardHeader>
          <CardContent>
            <p className="text-center text-5xl font-bold">
              {yearStats.wins} - {yearStats.losses}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-xl font-semibold">Points</CardHeader>
          <CardContent>
            <p className="text-center text-xl">
              For: {yearStats.pointsScored} | Against: {yearStats.pointsAgainst}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-xl font-semibold">Recent Games</CardHeader>
          <CardContent>
            <ul>
              {recentGames.map((game, index) => (
                <li key={index} className="mb-2">
                  Week {game.week}: {formatGameDisplay(game)} - {game.result} ({game.score})
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-xl font-semibold">Upcoming Games</CardHeader>
          <CardContent>
            <ul>
              {upcomingGames.map((game, index) => (
                <li key={index} className="mb-2">
                  Week {game.week}: {formatGameDisplay(game)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-xl font-semibold">Season Highlights</CardHeader>
          <CardContent>
            <p>Bowl Game: {yearStats.bowlGame || 'TBD'}</p>
            <p>Bowl Result: {yearStats.bowlResult || 'TBD'}</p>
            <p>Conference Standing: {yearStats.conferenceStanding || 'TBD'}</p>
            <p>Players Drafted: {yearStats.playersDrafted}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-xl font-semibold">Quick Links</CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/schedule" className="block">
                <Button className="w-full">View Full Schedule</Button>
              </Link>
              <Link href="/roster" className="block">
                <Button className="w-full">Manage Roster</Button>
              </Link>
              <Link href="/recruiting" className="block">
                <Button className="w-full">Recruiting</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="px-8 py-4 text-lg">End Year</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to end the year?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will save the current year's data and start a new year. This action cannot be undone.
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
