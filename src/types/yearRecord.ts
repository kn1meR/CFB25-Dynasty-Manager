// src/types/yearRecord.ts

export interface YearRecord {
  year: number;
  wins: number;
  losses: number;
  ties: number;
  confWins: number;
  confLosses: number;
  confTies: number;
  pointsFor: number;
  pointsAgainst: number;
  bowlGame: string;
  bowlResult?: string;
  bowlScore: { team: number; opponent: number };
  schedule: Game[];
  notes: string;
}

export interface Game {
  opponent: string;
  result: string;
  score: { team: number; opponent: number };
}
  
  export type AllRecords = {
    [year: number]: YearRecord;
  };