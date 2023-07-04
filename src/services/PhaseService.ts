import {Knockout, Phase} from "../models/Phase";
import {TournamentService} from "./TournamentService";
import {Tournament} from "../models/Tournament";
import {Match, MatchKnockout} from "../models/Match";

export class PhaseService {
    public GenerateGroupPhase(phase: Phase, tournament: Tournament, qualified: FlatArray<({
        team: string;
        position: number;
        group: number
    }[] | undefined)[], 1>[] | undefined) : Phase[] {
        const tournamentService = new TournamentService();
        const teamsPerGroup = Math.ceil(qualified!.length / phase.numberGroups!);
        const groups: string[][] = Array.from({length: phase.numberGroups!}, () => []);
        for (let i = 0; i < phase.numberGroups!; i++) {
            const group = groups[i];
            const groupTeam: any[] = [];

            while (group.length < teamsPerGroup && qualified!.length > 0) {
                for (let i = 0; i <= qualified?.length!; i++) {
                    if (!groupTeam.some(qg => qg.group === qualified![i]!.group || qg.position === qualified![i]!.position)) {
                        group.push(qualified![i]!.team);
                        groupTeam.push(qualified![i]);
                        qualified = qualified?.filter((q) => q!.team !== qualified![i]!.team)
                        break;
                    }
                }
            }

        }
        return tournamentService.GeneratePhase({...tournament, currentPhase: tournament.currentPhase + 1}, groups);
    }

    public GenerateKnockoutPhase(tournament: Tournament, teams: string[], qualified: FlatArray<({
        team: string;
        position: number;
        group: number
    }[] | undefined)[], 1>[] | undefined): Phase[] {
        const koPhase = {...tournament.phases[tournament.currentPhase + 1]};
        koPhase.knockout = {
            currentRound: 0,
            teams: teams,
            roundOf: Math.ceil(teams.length / 2),
            matches: this.generateNextPhaseMatches(qualified!, qualified?.length).slice(0, Math.ceil(teams.length / 2))
        } as Knockout;
        tournament.phases[tournament.currentPhase + 1] = koPhase;
        return [...tournament.phases]
    }

    private generateNextPhaseMatches(qualified: FlatArray<({
        team: string;
        position: number;
        group: number
    }[] | undefined)[], 1>[], numQualifiers: number | undefined): Match[] {
        // Sort the qualified teams by their group and position
        const sortedQualified = qualified.sort((a, b) => {
            if (a!.group !== b!.group) return a!.group - b!.group;
            return a!.position - b!.position;
        });

        // Group the qualified teams by their group
        const groupedQualified: { [key: number]: { team: string, position: number }[] } = {};
        sortedQualified.forEach((team) => {
            if (!groupedQualified[team!.group]) {
                groupedQualified[team!.group] = [];
            }
            groupedQualified[team!.group].push({ team: team!.team, position: team!.position });
        });

        // Pair the teams from different groups, with opposite positions
        const matches: MatchKnockout[] = [];
        let i = 0;
        while (i < numQualifiers!) {
            // Find the group of the i-th qualified team
            const groupIndex = Math.floor(i / (numQualifiers! / Object.keys(groupedQualified).length));
            const group = groupedQualified[groupIndex];

            // Determine the position of the i-th team in the group
            const positionInGroup = i % (numQualifiers! / Object.keys(groupedQualified).length);
            const teamA = group[positionInGroup].team;

            // Find the group with opposite position
            const oppositeGroupIndex = (groupIndex + Object.keys(groupedQualified).length / 2) % Object.keys(groupedQualified).length;
            const oppositeGroup = groupedQualified[oppositeGroupIndex];

            // Determine the opposite position in the opposite group
            const oppositePositionInGroup = numQualifiers! / Object.keys(groupedQualified).length - positionInGroup - 1;
            const teamB = oppositeGroup[oppositePositionInGroup].team;

            // Add the match to the list
            matches.push({
                teams: [teamA, teamB],
                round: numQualifiers! / 2
            });
            i++;
        }
        return matches;
    }
}