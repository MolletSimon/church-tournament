import {Tournament} from "../models/Tournament";
import {Ranking} from "../models/Ranking";
import {Match} from "../models/Match";

export class RankingService {
    public ComputeRanking(ranks: Ranking[], match: Match, tournament: Tournament, index: number): Ranking[] {
        ranks.forEach(team => {
            team = this.InitTeam(team);
            const teamMatches = tournament.phases[0].groups![index].matches.filter((match) => match.teams.includes(team.team));
            teamMatches.forEach((teamMatch) => {
                switch (teamMatch.winner) {
                    case team.team:
                        this.handleTeamWin(team, teamMatch);
                        break;
                    case "Aucun":
                        this.handleTeamDraw(team, teamMatch);
                        break;
                    default:
                        this.handleTeamLoss(team, teamMatch);
                        break;
                }
            });
        });
        ranks.sort((a,b) => (b.points - a.points))
        ranks.forEach((r, i) => r.position = i + 1)
        return ranks;
    }

    public DetermineWinner(match: Match): Match {
        if (match.score1 === match.score2) {
            match.winner = "Aucun";
        } else {
            if (match.score1! > match.score2!) match.winner = match.teams[0];
            else match.winner = match.teams[1];
        }
        return match;
    }

    private InitTeam(team: Ranking) {
        team.goalScored = 0;
        team.numberLose = 0;
        team.points = 0;
        team.goalTaken = 0;
        team.numberWin = 0;
        team.numberDraw = 0;
        return team;
    }

    private handleTeamWin(team: Ranking, teamMatch: Match) {
        team.points += 3;
        team.numberWin++;
        team.goalScored += Math.max(teamMatch.score1!, teamMatch.score2!);
        team.goalTaken += Math.min(teamMatch.score1!, teamMatch.score2!);
    }

    private handleTeamDraw(team: Ranking, teamMatch: Match) {
        team.points++;
        team.numberDraw++;
        team.goalScored += teamMatch.score1!;
        team.goalTaken += teamMatch.score1!;
    }

    private handleTeamLoss(team: Ranking, teamMatch: Match) {
        team.numberLose++;
        team.goalScored += Math.min(teamMatch.score1!, teamMatch.score2!);
        team.goalTaken += Math.max(teamMatch.score1!, teamMatch.score2!);
    }
}