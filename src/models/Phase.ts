import {Group} from "./Group";
import {MatchKnockout} from "./Match";

export type Knockout = {
    matches?: MatchKnockout[],
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

