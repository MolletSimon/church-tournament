import {Ranking} from "./Ranking";

import {Match} from "./Match";

export type Group = {
    teams: string[];
    ranking?: Ranking[];
    matches: Match[];
}