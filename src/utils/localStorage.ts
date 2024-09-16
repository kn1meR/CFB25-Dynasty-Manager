// utils/localStorage.ts

export interface Game {
  id: number;
  week: number;
  location: '@' | 'vs' | 'neutral' | ' ';
  opponent: string;
  result: 'Win' | 'Loss' | 'Tie' | 'Bye' | 'N/A';
  score: string;
}

export interface YearStats {
  wins: number;
  losses: number;
  conferenceWins: number;
  conferenceLosses: number;
  pointsScored: number;
  pointsAgainst: number;
  playersDrafted: number;
  conferenceStanding: string;
  bowlGame: string;
  bowlResult: string;
}

export const getCurrentYear = (): number => {
  if (typeof window !== 'undefined') {
    const storedYear = localStorage.getItem('currentYear');
    return storedYear ? parseInt(storedYear, 10) : new Date().getFullYear();
  }
  return new Date().getFullYear();
};

export const setCurrentYear = (year: number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentYear', year.toString());
  }
};

export const getSchedule = (year: number): Game[] => {
  if (typeof window !== 'undefined') {
    const storedSchedule = localStorage.getItem(`schedule_${year}`);
    if (storedSchedule) {
      return JSON.parse(storedSchedule);
    }
  }
  return [];
};

export const setSchedule = (year: number, schedule: Game[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`schedule_${year}`, JSON.stringify(schedule));
  }
};

export const calculateStats = (schedule: Game[]): YearStats => {
  let wins = 0, losses = 0, pointsScored = 0, pointsAgainst = 0;
  schedule.forEach(game => {
    if (game.result === 'Win') wins++;
    if (game.result === 'Loss') losses++;
    if (game.score) {
      const [teamScore, opponentScore] = game.score.split('-').map(Number);
      if (!isNaN(teamScore) && !isNaN(opponentScore)) {
        pointsScored += teamScore;
        pointsAgainst += opponentScore;
      }
    }
  });
  
  return {
    wins,
    losses,
    conferenceWins: 0, // You might want to calculate these based on your conference games
    conferenceLosses: 0,
    pointsScored,
    pointsAgainst,
    playersDrafted: 0,
    conferenceStanding: '',
    bowlGame: '',
    bowlResult: '',
  };
};

export const getYearStats = (year: number): YearStats => {
  if (typeof window !== 'undefined') {
    const storedStats = localStorage.getItem(`yearStats_${year}`);
    if (storedStats) {
      return JSON.parse(storedStats);
    }
  }
  return {
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
  };
};

export const setYearStats = (year: number, stats: YearStats): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`yearStats_${year}`, JSON.stringify(stats));
  }
};

// TODO: Add Method to Generate and Save Year Record