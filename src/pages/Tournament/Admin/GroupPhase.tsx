import {Button} from "../../../components/generic/Button";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {RankingService} from "../../../services/RankingService";
import {Match} from "../../../models/Match";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../index";
import {Tournament} from "../../../models/Tournament";

interface Props {
	tournament: Tournament,
	setTournament: (value: Tournament) => void,
	handleNextPhase: () => void,
}

export const GroupPhase:React.FC<Props> = ({tournament, setTournament, handleNextPhase}) => {
	let groups = tournament.phases[tournament.currentPhase].groups!;
	const navigate = useNavigate();
	const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);
	const rankingService = new RankingService();
	const [selectedGroup, setSelectedGroup] = useState(groups[selectedGroupIndex]);

	useEffect(() => {
		groups = tournament.phases[tournament.currentPhase].groups!;
		setSelectedGroup(groups[0])
	}, [tournament.currentPhase, tournament.phases])

	const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		let newIndex = parseInt(event.target.value);
		setSelectedGroupIndex(newIndex);
		const matches = groups[newIndex].matches;

		const updatedMatches = matches.map((match, matchIndex) => {
			const updatedMatch = matches[matchIndex];
			return {
				...match,
				score1: updatedMatch.score1 !== undefined ? updatedMatch.score1 : null,
				score2: updatedMatch.score2 !== undefined ? updatedMatch.score2 : null,
			};
		});
		setSelectedGroup({...groups[newIndex], matches: updatedMatches});
	};

	const handleScoreChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
		const newScore = e.target.value ? parseInt(e.target.value) : null;
		const teamIndex = e.target.id === "score1" ? 0 : 1;
		const newMatch = { ...match, [`score${teamIndex + 1}`]: newScore };
		await updateMatch(newMatch, matchIndex);
	};

	const handleFieldChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
		const newField = e.target.value;
		const newMatch = { ...match, field: newField };
		await updateMatch(newMatch, matchIndex);
	};

	const handleHourChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
		const newHour = e.target.value;
		const newMatch = { ...match, hour: newHour };
		await updateMatch(newMatch, matchIndex);
	};

	const updateMatch = async (newMatch: Match, matchIndex: number) => {
		const updateTournament = { ...tournament };
		const group = updateTournament.phases[tournament.currentPhase].groups![selectedGroupIndex];
		group.matches[matchIndex] = newMatch;
		setSelectedGroup(group);
		await setDoc(doc(db, "tournaments", tournament.id!), updateTournament);
		setTournament(updateTournament);

		if (newMatch.score1 != null && newMatch.score2 != null) {
			let teamsRank = updateTournament.phases[0].groups![selectedGroupIndex].ranking!;
			newMatch = rankingService.DetermineWinner(newMatch);
			rankingService.ComputeRanking(teamsRank, newMatch, updateTournament, selectedGroupIndex);

			await setDoc(doc(db, "tournaments", tournament.id!), updateTournament);
			setTournament(updateTournament);
		}
	};

	return (
		<>

			<div className="flex items-center mt-8 px-4 sm:px-0">
				<h1 className="font-bold text-primary text-3xl self-center sm:ml-20">
					{tournament.name} - Phase : {tournament.phases[tournament.currentPhase].name}
				</h1>
			</div>

			<div className="space-y-4 px-4 sm:mx-16 mt-20">
				<div className="flex items-center space-x-2">
					<label htmlFor="group" className="font-medium text-gray-700">
						Groupe
					</label>
					<select
						id="group"
						name="group"
						className="px-3 pr-10 py-2 text-base border-primary bg-primary text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
						value={selectedGroupIndex}
						onChange={handleGroupChange}
					>
						{groups.map((group, index) => (
							<option key={index} value={index}>
								{`Groupe ${index + 1}`}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col sm:flex-row w-full justify-between items-start">
					<ul className="divide-y divide-gray-200 p-4 px-8 rounded-xl mt-10 w-full sm:w-auto">
						{selectedGroup.matches.map((match, matchIndex) => (
							<li key={matchIndex} className="py-4 pl-0 flex justify-center">
								<div className="w-full">
									<div className="flex items-center space-x-4">
										<div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
											{match.teams[0].charAt(0)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900">
												{match.teams[0]}
											</p>
										</div>
										<div className="flex items-center space-x-2">
											<input
												type="number"
												id="score1"
												onChange={(e) =>
													handleScoreChange(e, match, matchIndex)
												}
												className="w-20 border border-gray-300 rounded-md text-lg text-primary font-bold py-2 px-3 text-center"
												value={match.score1 != null ? match.score1 : ""}
											/>
											<span className="text-sm text-gray-500">-</span>
											<input
												type="number"
												id="score2"
												onChange={(e) =>
													handleScoreChange(e, match, matchIndex)
												}
												className="w-20 border border-gray-300 rounded-md text-lg text-primary font-bold py-2 px-3 text-center"
												value={match.score2 != null ? match.score2 : ""}
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900 text-end">
												{match.teams[1]}
											</p>
										</div>
										<div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
											{match.teams[1].charAt(0)}
										</div>
										<div className="flex items-center space-x-2">
											<input
												type="text"
												id="field"
												onChange={(e) =>
													handleFieldChange(e, match, matchIndex)
												}
												className="w-40 border border-gray-300 rounded-md text-lg text-primary font-bold py-2 px-3 text-center"
												value={match.field != null ? match.field : ""}
												placeholder="Terrain"
											/>
											<input
												type="text"
												id="hour"
												onChange={(e) =>
													handleHourChange(e, match, matchIndex)
												}
												className="w-24 border border-gray-300 rounded-md text-lg text-primary font-bold py-2 px-3 text-center"
												value={match.hour != null ? match.hour : ""}
												placeholder="Heure"
											/>
										</div>
									</div>
								</div>
							</li>

						))}
					</ul>
					<div className="flex justify-center items-center w-full sm:w-1/2 p-4 ml-8 mt-10">
						<div className="flex flex-col w-full ">
							<div>
								<table className="table-fixed w-full border-2 rounded-lg">
									<thead>
									<tr className="font-bold">
										<th className="w-1/12 px-4 py-2 text-left">P</th>
										<th className="w-1/4 px-4 py-2">E</th>
										<th className="w-1/12 px-4 py-2">BM</th>
										<th className="w-1/12 px-4 py-2">BE</th>
										<th className="w-1/12 px-4 py-2">Diff</th>
										<th className="w-1/12 px-4 py-2">Pts</th>
									</tr>
									</thead>
									<tbody>
									{selectedGroup.ranking &&
										selectedGroup.ranking.map((team, index) => (
											<tr
												key={index}
												className={index < tournament.phases[tournament.currentPhase].numberQualifiedByGroup ? "bg-green-500 text-white" : ""}
											>
												<td className="border px-4 py-2">{team.position}</td>
												<td className="border px-4 py-2 text-center">{team.team}</td>
												<td className="border px-4 py-2 text-center">{team.goalScored}</td>
												<td className="border px-4 py-2 text-center">{team.goalTaken}</td>
												<td className="border px-4 py-2 text-center">
													{team.goalScored - team.goalTaken}
												</td>
												<td className="border px-4 py-2 text-center">{team.points}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="flex flex-col sm:flex-row justify-end gap-8 mt-10">
								<Button
									text="Retour"
									color="danger"
									action={() => navigate("/")}
								/>
								<Button
									text="Reinitialiser la phase"
									color="warning"
									action={() => navigate("/")}
								/>
								<Button
									text="Finaliser cette phase !"
									color="primary"
									action={handleNextPhase}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}