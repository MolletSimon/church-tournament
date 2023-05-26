export type Phase = {
    id?: number,
    name?: string,
    type?: 'Poules' | 'Elimination directe';
    isHomeAndAway: boolean,
    numberTeamsByGroup: number,
    numberQualifiedByGroup: number,
    numberGroups : number,
    active: boolean,
    groups?: Group[]
}

export type Match = {
    teams: string[];
    score1?: number;
    score2?: number;
    winner?: string;
}

export type Group = {
    teams: string[];
    ranking?: Ranking[];
    matches: Match[];
}

export type Ranking = {
    position: number;
    points: number;
    team: string;
}