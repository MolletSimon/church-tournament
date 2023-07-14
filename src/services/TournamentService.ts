import {Tournament} from "../models/Tournament";
import {Phase} from "../models/Phase";
import {Ranking} from "../models/Ranking";
import {Group} from "../models/Group";
import { getDocs, collection, Timestamp, doc, getDoc } from "firebase/firestore";
import { db } from "..";

export class TournamentService {
    public GeneratePhase(tournament: Tournament, groups?: string[][]): Phase[] {
        return tournament.phases.map((phase, index) => {
            if (index === tournament.currentPhase) {
                if (phase.type === 'Poules') {
                    const updatedGroups = new Array<Group>();
                    for (let i = 0; i < phase.numberGroups!; i++) {
                        const teamsGroup = groups![i];
                        const matches = this.createMatchs(teamsGroup, phase.isHomeAndAway!);
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
                            teams: groups![i],
                            matches: matches,
                            ranking: rankings
                        });
                    }

                    return {...phase, groups: updatedGroups};
                } else {

                }
            }
            return phase;
        })
    }

    public async FetchTournament(id: string): Promise<Tournament> {
        let tournament = {} as Tournament;

        const docRef = doc(db, "tournaments", id!);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			tournament = docSnap.data() as Tournament;
			const date = tournament.dateTournament as unknown as Timestamp;
            tournament.dateTournament = date.toDate();
		} else {
			console.error("No such document!");
		}

        return tournament;
    }


    public async FetchTournaments(): Promise<Tournament[]> {
        let tournaments = [] as Tournament[];
        await getDocs(collection(db, "tournaments"))
            .then((querySnapshot) => {
                let dataTournaments = querySnapshot.docs.map((doc) => ({...doc.data(),})) as Tournament[];
                tournaments = dataTournaments.map((tournament) => ({
                    ...tournament,
                    dateTournament: (tournament.dateTournament as unknown as Timestamp)?.toDate()}));
                });

        return tournaments;
    }

    private createMatchs(teams: string[], isHomeAndAway: boolean) {
        const numTeams = teams.length;
        const halfNumTeams = Math.ceil(numTeams / 2);
        const rounds = numTeams - 1;
        const matches = [];

        // Générer les matchs pour la première journée
        for (let i = 0; i < halfNumTeams; i++) {
            const homeTeam = teams[i];
            const awayTeam = teams[numTeams - i - 1];
            if (homeTeam && awayTeam) {
                matches.push({ teams: [homeTeam, awayTeam] });
                if (isHomeAndAway) {
                    matches.push({ teams: [awayTeam, homeTeam] });
                }
            }
        }

        // Générer les matchs pour les journées suivantes
        for (let round = 1; round < rounds; round++) {
            const roundMatches = [];
            const pivot = teams.shift()!;
            teams.splice(halfNumTeams, 0, pivot);
            for (let i = 0; i < halfNumTeams; i++) {
                const homeTeam = teams[i];
                const awayTeam = teams[numTeams - i - 1];
                if (homeTeam && awayTeam) {
                    roundMatches.push({ teams: [homeTeam, awayTeam] });
                    if (isHomeAndAway) {
                        roundMatches.push({ teams: [awayTeam, homeTeam] });
                    }
                }
            }
            matches.push(...roundMatches);
        }

        return matches;
    }
}