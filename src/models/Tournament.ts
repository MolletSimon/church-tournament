export type Tournament = {
    name?: string,
    numberTeams?: number,
    dateTournament?: Date,
    teams: string[],
    phases: Phase[],
    numberPhase?: number
}

export type Phase = {
    name?: string,
    type?: 'Poules' | 'Elimination directe';
}