import {Phase} from "./Phase";

export type Tournament = {
    id?: string,
    name?: string,
    numberTeams?: number,
    dateTournament?: Date,
    teams: string[],
    phases: Phase[],
    numberPhase?: number,
    status: "started" | "init" | "drawMade"
}

