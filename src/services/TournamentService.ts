import {Tournament} from "../models/Tournament";
import {TournamentFromFirestore} from "../models/TournamentData";

export class TournamentService {
    public static ConvertTournamentFromTournamentData(data: TournamentFromFirestore): Tournament {
        return {
            dateTournament: data.dateTournament.toDate(),
            numberTeams: data.numberTeams,
            phases: data.phases,
            numberPhase: data.numberPhase,
            teams: data.teams,
            name: data.name,
            id: data.id
        } as Tournament;
    }
}