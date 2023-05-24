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

export type Group = {
    teams: string[];
    ranking?: Ranking[];
}

export type Ranking = {
    position: number;
    numberPoints: number;
    team: string;
}