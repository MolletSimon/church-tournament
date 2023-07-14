import {Tournament} from "../models/Tournament";
import {Ranking} from "../models/Ranking";
import {Match} from "../models/Match";

export class RankingService {
    public ComputeRanking(teams: string[], tournament: Tournament, index: number): Ranking[] {
        const ranks: Ranking[] = [];
        teams.forEach(team => {
            const teamInRank = this.InitTeam(team);
            const teamMatches = tournament.phases[tournament.currentPhase].groups![index].matches.filter((match) => match.teams.includes(teamInRank.team));
            teamMatches.forEach((teamMatch) => {
                switch (teamMatch.winner) {
                    case teamInRank.team:
                        this.handleTeamWin(teamInRank, teamMatch);
                        break;
                    case "Aucun":
                        this.handleTeamDraw(teamInRank, teamMatch);
                        break;
                    default:
                        this.handleTeamLoss(teamInRank, teamMatch);
                        break;
                }
            });
            ranks.push(teamInRank);
        });

        ranks.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }

            if ((b.goalScored - b.goalTaken) !== (a.goalScored - a.goalTaken)) {
                return (b.goalScored - b.goalTaken) - (a.goalScored - a.goalTaken);
            }
            return b.goalScored - a.goalScored;
        });
        
        ranks.forEach((r, i) => r.position = i + 1)
        return ranks;
    }

    public DetermineWinner(match: Match): Match  {
        // tab a eu lieu
        if (match.tab1 && match.tab2) {
            match.winner = match.tab1 < match.tab2 ? match.teams[1] : match.teams[0]
            return match;
        } 

        if (match.score1 == null || match.score2 == null) {
            delete match.winner;
            return match
        }

        if (match.score1 === match.score2) {
                match.winner = "Aucun";
                return match;
        }
        if (match.score1! > match.score2!) match.winner = match.teams[0];
        else match.winner = match.teams[1];

        return match;
    }

    private InitTeam(team: string) {
        const teamRanking = {} as Ranking;
        teamRanking.goalScored = 0;
        teamRanking.numberLose = 0;
        teamRanking.points = 0;
        teamRanking.goalTaken = 0;
        teamRanking.numberWin = 0;
        teamRanking.numberDraw = 0;
        teamRanking.team = team
        return teamRanking;
    }

    private handleTeamWin(team: Ranking, teamMatch: Match) {
        team.points += 3;
        team.numberWin++;
        team.goalScored += this.checkScoreNull(teamMatch) ? Math.max(teamMatch.score1!, teamMatch.score2!) : 0;
        team.goalTaken += this.checkScoreNull(teamMatch) ? Math.min(teamMatch.score1!, teamMatch.score2!) : 0;
    }

    private handleTeamDraw(team: Ranking, teamMatch: Match) {
        team.points++;
        team.numberDraw++;
        team.goalScored += this.checkScoreNull(teamMatch) ? teamMatch.score1! : 0;
        team.goalTaken += this.checkScoreNull(teamMatch) ? teamMatch.score1! : 0;
    }

    private handleTeamLoss(team: Ranking, teamMatch: Match) {
        team.numberLose++;
        team.goalScored += this.checkScoreNull(teamMatch) ? Math.min(teamMatch.score1!, teamMatch.score2!) : 0;
        team.goalTaken += this.checkScoreNull(teamMatch) ? Math.max(teamMatch.score1!, teamMatch.score2!) : 0;
    }

    private checkScoreNull(m: Match) {
        return m.score1 != null && m.score2 != null;
    }
}