import React, { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {Match} from "../../../models/Match";
import {Tournament} from "../../../models/Tournament";
import {db} from "../../../index";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaFutbol, FaMapMarkerAlt } from "react-icons/fa";
import {Button} from "../../../components/generic/Button";
import {Phase} from "../../../models/Phase";
import {Group} from "../../../models/Group";

type TeamMatch = {
	match: Match;
	isUpcoming: boolean;
};

const TeamPage = () => {
	const { tournamentId, teamName } = useParams<{ tournamentId: string; teamName: string }>();
	const [tournament, setTournament] = useState<Tournament>();
	const [teamMatches, setTeamMatches] = useState<TeamMatch[]>([]);
	const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);
	const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

	useEffect(() => {
		const fetchTournament = async () => {
			if (tournamentId != null) {
				const docRef = doc(db, "tournaments", tournamentId);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const tournament = docSnap.data() as Tournament;
					setTournament(tournament);
					setCurrentPhase(tournament.phases[tournament.currentPhase]);
					setCurrentGroup(tournament.phases[tournament.currentPhase].groups!.find(g => g.teams!.includes(teamName!)) ?? null)
				} else {
					console.log("No such document!");
				}
			}
		};

		fetchTournament();
	}, [tournamentId]);

	useEffect(() => {
		if (tournament) {
			const matches = tournament.phases[tournament.currentPhase].groups?.flatMap(group => group.matches || []);
			const teamMatches = matches?.filter(match => match.teams.includes(teamName!)).map(match => {
				const isUpcoming = !match.winner;
				return { match, isUpcoming };
			}) || [];
			setTeamMatches(teamMatches);
		}
	}, [tournament, teamName]);

	const teamResult = (match: Match) => {
		return match.winner === 'Aucun' ? 'text-warning' : match.winner === teamName ? 'text-green-600' : match.score1 && match.score2 ? 'text-danger' : 'text-lg text-primary italic';
	}

	const teamWon = (team: string, match: Match) => {
		return match.winner === team ? "text-success font-bold":"";
	}

	return (
		<div className="min-h-screen bg-[#F9F9FB]">
			<div className=" py-6 mb-4 flex px-10 justify-center gap-4 items-center">
				<img src="/images/football-team.png" width={30}/>
				<h1 className="text-primary text-center font-bold text-3xl">{teamName}</h1>
			</div>
			<div className="px-4">
				{teamMatches.length > 0 ? (
					<div className="grid grid-cols-1 gap-4">
						{teamMatches.map(({ match, isUpcoming }) => (
							<div
								key={`${match.teams[0]}-${match.teams[1]}`}
								className="bg-white rounded-2xl px-4 py-4 text-gray-800"
							>
								<div className="flex flex-col py-2">
									<div className={`text-lg pb-4  flex justify-between ${teamWon(match.teams[0], match)}`}>
										<p className="w-1/3">{match.teams[0]}</p>
										{match.score1 !== undefined ? <p>{match.score1}</p> : <div className="flex items-center">
											<FaMapMarkerAlt className="text-primary text-sm mr-2" />
											<p className="text-sm italic text-primary">{match.field || "à déterminer"}</p> </div>}
									</div>
									{/*<div className={`text-center text-2xl font-bold ${teamResult(match)}`}>
										{match.score1 && match.score2
											? `${match.score1} - ${match.score2}`
											: "À venir"}
									</div>*/}
									<div className={`text-lg flex justify-between ${teamWon(match.teams[1], match)}`}>
										<p className="w-2/5">{match.teams[1]}</p>
										{match.score2 !== undefined ? <p>{match.score2}</p> : <div className="flex items-center">
											<AiOutlineClockCircle className="text-primary mr-2 text-sm" />
											<p className="text-sm italic text-primary">{match.hour || "à déterminer"}</p>
										</div>}
									</div>
								</div>
							</div>
						))}

						<div className="border-2 rounded-xl">
							<table className="table-fixed w-full divide-y divide-gray-200">
								<thead className="rounded-lg">
								<tr className="font-bold rounded-lg">
									<th className="w-1/12 px-4 py-2 text-left">N°</th>
									<th className="w-1/4 px-4 py-2">Equipe</th>
									<th className="w-1/12 px-4 py-2">Diff</th>
									<th className="w-1/12 px-4 py-2">Pts</th>
								</tr>
								</thead>
								<tbody>
								{currentGroup?.ranking &&
									currentGroup.ranking!.map((team, index) => (
										<tr
											key={index}
											className={index < tournament?.phases[tournament.currentPhase].numberQualifiedByGroup! ? "bg-green-100 text-black" : ""}
										>
											{index < tournament?.phases[tournament.currentPhase].numberQualifiedByGroup! ?
												<td className="px-5 border-l-8 border-l-green-500">{team.position}</td> : <td className="px-6 py-4">{team.position}</td>
											}

											<td className="px-6 py-4 text-center uppercase font-bold">{team.team}</td>
											<td className="px-6 py-4 text-center">
												{team.goalScored - team.goalTaken}
											</td>
											<td className="px-4 py-2 text-center">{team.points}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>


						<div className="flex justify-center mt-8 mb-16">
							<Link to={`/${tournamentId}`} >
								<Button
									text="Retour"
									color="danger"
									hoverColor="red-600"
								/>
							</Link>
						</div>
					</div>
				) : (
					<div className="text-center text-gray-500 py-4">
						Aucun match trouvé pour l'équipe sélectionnée.
					</div>
				)}
			</div>
		</div>
	);
};

export default TeamPage;