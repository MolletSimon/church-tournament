import {Group} from "./Group";

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

