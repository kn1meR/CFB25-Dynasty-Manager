// src/electron/store.ts

import Store from 'electron-store';

interface StoreSchema {
  currentYear: number;
  coachName: string;
  schoolName: string;
  players: any[];
  schedules: { [year: number]: any[] };
  yearStats: { [year: number]: any };
  recruits: any[];
  transfers: any[];
  awards: any[];
  trophies: any[];
}

const store = new Store<StoreSchema>({
  defaults: {
    currentYear: new Date().getFullYear(),
    coachName: '',
    schoolName: '',
    players: [],
    schedules: {},
    yearStats: {},
    recruits: [],
    transfers: [],
    awards: [],
    trophies: []
  }
});

export default store;