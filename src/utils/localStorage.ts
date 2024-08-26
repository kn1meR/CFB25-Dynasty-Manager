// utils/localStorage.ts

export interface Game {
  id: number;
  week: number;
  opponent: string;
  result: string;
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
      const parsedSchedule = JSON.parse(storedSchedule);
      // Ensure we always return an array of 18 games, starting from week 0
      return Array.from({ length: 18 }, (_, i) => {
        const existingGame = parsedSchedule.find((game: Game) => game.week === i);
        return existingGame || { id: i, week: i, opponent: '', result: 'N/A', score: '' };
      });
    }
  }
  return Array.from({ length: 18 }, (_, i) => ({ 
    id: i, 
    week: i, 
    opponent: '', 
    result: 'N/A', 
    score: '' 
  }));
};

export const setSchedule = (year: number, schedule: Game[]): void => {
  if (typeof window !== 'undefined') {
    // Ensure we're always storing 18 games, starting from week 0
    const fullSchedule = Array.from({ length: 18 }, (_, i) => {
      const existingGame = schedule.find(game => game.week === i);
      return existingGame || { id: i, week: i, opponent: '', result: 'N/A', score: '' };
    });
    localStorage.setItem(`schedule_${year}`, JSON.stringify(fullSchedule));
  }
};

export const getYearStats = (year: number): YearStats => {
  if (typeof window !== 'undefined') {
    const storedStats = localStorage.getItem(`yearStats_${year}`);
    return storedStats ? JSON.parse(storedStats) : {
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

export const calculateStats = (schedule: Game[]): Partial<YearStats> => {
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
  return { wins, losses, pointsScored, pointsAgainst };
};