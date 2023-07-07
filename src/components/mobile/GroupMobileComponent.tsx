import {FaMapMarkerAlt} from "react-icons/fa";
import {AiOutlineClockCircle} from "react-icons/ai";
import {Link} from "react-router-dom";
import {Button} from "../generic/Button";
import React from "react";
import {Match} from "../../models/Match";
import {Group} from "../../models/Group";
import {Tournament} from "../../models/Tournament";
import {MatchMobileComponent} from "./MatchMobileComponent";

interface Props {
	teamMatches: Match[],
	currentGroup: Group,
	tournament: Tournament,
	tournamentId: string
}

export const GroupMobileComponent: React.FC<Props> = ({teamMatches, currentGroup, tournament, tournamentId}) => {
	const teamWon = (team: string, match: Match) => {
		return match.winner === team ? "text-success font-bold":"";
	}

	return (
		<>
			{teamMatches.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{teamMatches.map((m) => (
						<div
							key={`${m.teams[0]}-${m.teams[1]}`}
							className="bg-white rounded-2xl px-4 py-4 text-gray-800"
						>
							<MatchMobileComponent teamWon={teamWon} m={m} />
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
					Aucun match trouvé pour l'équipe sélectionnée. L'équipe se situe peut être dans le tournoi consolante
					<Link to={`/${tournament.looserTournament}`}>
						<Button text="Tournoi consolante" color="primary" />
					</Link>
				</div>
			)}
		</>
	)
}