import {Phase} from "./Phase";

export type Tournament = {
    id?: string,
    name?: string,
    numberTeams?: number,
    dateTournament?: Date,
    teams: string[],
    phases: Phase[],
    currentPhase: number,
    numberPhase?: number,
    status: "started" | "init" | "drawMade"
}

