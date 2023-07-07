export type Match = {
    teams: string[];
    score1?: number | null;
    score2?: number | null;
    winner?: string;
    played?: false;
    field?: string;
    hour?: string;
    tab1?: number;
    tab2?: number;
}

export interface MatchKnockout extends Match {
    round: number
}