import {Tournament} from "../models/Tournament";
import {Phase} from "../models/Phase";
import {Ranking} from "../models/Ranking";
import {Group} from "../models/Group";
import {Match} from "../models/Match";

export class TournamentService {
    public GeneratePhase(tournament: Tournament, groups: string[][]): Phase[] {
        return tournament.phases.map((phase, index) => {
            if (index === tournament.currentPhase) {
                if (phase.type === 'Poules') {
                    const updatedGroups = new Array<Group>();
                    for (let i = 0; i < phase.numberGroups; i++) {
                        const matches = new Array<Match>();
                        const teamsGroup = groups[i];
                        for (let j = 0; j < teamsGroup.length; j++) {
                            for (let k = j + 1; k < teamsGroup.length; k++) {
                                matches.push({
                                    teams: [teamsGroup[j], teamsGroup[k]],
                                });

                                if (phase.isHomeAndAway) {
                                    matches.push({
                                        teams: [teamsGroup[k], teamsGroup[j]],
                                    });
                                }
                            }
                        }
                        const rankings = [] as Ranking[];
                        teamsGroup.forEach((team, index) => {
                            rankings.push({
                                position: index + 1,
                                team: team,
                                points: 0,
                                goalScored: 0,
                                goalTaken: 0,
                                numberDraw: 0,
                                numberLose: 0,
                                numberWin: 0
                            })
                        })
                        updatedGroups.push({
                            teams: groups[i],
                            matches: matches,
                            ranking: rankings
                        });
                    }

                    return {...phase, groups: updatedGroups};
                }
            }
            return phase;
        })
    }
}