import {Group} from "./Group";
import {Match} from "./Match";

export type Knockout = {
    matches?: Match[],
    teams?: string[],
    roundOf?: number,
    currentRound?: number
}

export type Phase = {
    id?: number,
    name?: string,
    type?: 'Poules' | 'Elimination directe';
    isHomeAndAway?: boolean,
    numberTeamsByGroup?: number,
    numberQualifiedByGroup?: number,
    numberGroups?: number,
    active: boolean,
    knockout?: Knockout
    groups?: Group[]
}

