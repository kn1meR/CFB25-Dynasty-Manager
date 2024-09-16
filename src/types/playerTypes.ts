// This file should contain types relating to a player's information (recruiting, roster, transfer, etc.)

export interface Player {
    id: number;
    name: string;
    position: string;
    year: string;
    rating: string;
}

export interface Recruit {
    id: number,
    recruitedYear: number;
    name: string;
    stars: string;
    position: string;
    rating: string;
    potential: string;
}

export interface Transfer {
    id: number;
    transferYear: number;
    playerName: string;
    position: string;
    stars: string;
    transferDirection: 'From' | 'To';
    school: string;
}

export interface DraftedPlayer {
    playerName: string;
    round: string;
}