import {Timestamp} from "firebase/firestore";

import {Phase} from "./Phase";

export interface TournamentFromFirestore {
    dateTournament: Timestamp,
    id?: string,
    name?: string,
    numberTeams?: number,
    teams: string[],
    phases: Phase[],
    numberPhase?: number,
    isDrawDone: boolean
}