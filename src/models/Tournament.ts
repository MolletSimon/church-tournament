export type Tournament = {
    name?: string,
    numberTeams?: number,
    dateTournament?: Date,
    teams: string[],
    phases: Phase[],
    numberPhase?: number
}

export type Phase = {
    id?: number,
    name?: string,
    type?: 'Poules' | 'Elimination directe';
    isAllerRetour: boolean,
    nombreEquipesParPoule: number,
    nombreQualifiesParPoule: number,
}