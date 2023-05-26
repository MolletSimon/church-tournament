import React, {useState} from "react";
import {Tournament} from "../../../models/Tournament";
import {Button} from "../../../components/generic/Button";
import {useNavigate} from "react-router-dom";
import {Match, Phase} from "../../../models/Phase";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../index";

interface Props {
	tournament: Tournament,
	setTournament: (value: Tournament) => void;
}

export const TournamentStarted:React.FC<Props>  = ({tournament, setTournament}) => {
	const groups = tournament.phases[0].groups!;
	const navigate = useNavigate();
	const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);

	const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedGroupIndex(parseInt(event.target.value));
	};

	const handleScoreChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
		if(e.target.id === "score1") match.score1 = parseInt(e.target.value);
		else match.score2 = parseInt(e.target.value);

		if (match.score1 != null && match.score2 != null) {
			if (match.score1 > match.score2) match.winner = match.teams[0];
			else if (match.score2 > match.score1) match.winner = match.teams[1];
			else match.winner = "Aucun";

			const updateTournament = {...tournament};
			updateTournament.phases[0].groups![selectedGroupIndex].matches[matchIndex] = match;
			updateTournament.phases[0].groups![selectedGroupIndex].ranking!.find((r) => r.team === match.winner)!.points += 3;
			await setDoc(doc(db, "tournaments", tournament.id!), updateTournament);
			setTournament(updateTournament);
		}
	}

	const selectedGroup = groups[selectedGroupIndex];

	return (
		<>
			<div className="flex items-center mt-8">
				<Button text="Retour" color="danger" action={() => navigate("/")} additionalClass="ml-8" />
				<h1 className="font-bold text-primary text-3xl self-center ml-20">{tournament.name}</h1>
			</div>

			<div className="space-y-4 mx-32 mt-20">
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
				<div className="flex w-full justify-between">
					<ul className="divide-y divide-gray-200 p-4 border-2 border-primary px-8 rounded-xl mt-10">
						{selectedGroup.matches.map((match, matchIndex) => (
							<li key={matchIndex} className="py-4 flex justify-center">
								<div className="w-full">
									<div className="flex items-center space-x-4">
										<div className="flex items-center justify-center h-8 w-8 rounded-full bg-pink text-white">
											{match.teams[0].charAt(0)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900">{match.teams[0]}</p>
										</div>
										<div className="flex items-center space-x-2">
											<input type="number" id="score1" onChange={(e) => handleScoreChange(e, match, matchIndex)} className="w-20 border border-gray-300 rounded-md text-lg text-primary font-bold py-2 px-3 text-center" defaultValue={match.score1} />
											<span className="text-sm text-gray-500">-</span>
											<input type="number" id="score2" onChange={(e) => handleScoreChange(e, match, matchIndex)} className="w-20 border border-gray-300 rounded-md text-lg text-primary font-bold py-2 px-3 text-center" defaultValue={match.score2} />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900 text-end">{match.teams[1]}</p>
										</div>
										<div className="flex items-center justify-center h-8 w-8 rounded-full bg-pink text-white">
											{match.teams[1].charAt(0)}
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
					<div className="flex justify-center items-center w-1/2 p-4">
						<div>
						<table className="table-fixed border-2">
							<thead>
							<tr className="font-bold">
								<th className="w-1/4 px-4 py-2">Position</th>
								<th className="w-1/4 px-4 py-2">Équipe</th>
								<th className="w-1/4 px-4 py-2">Points</th>
							</tr>
							</thead>
							<tbody>
							{selectedGroup.ranking && selectedGroup.ranking.map((team, index) => (
								<tr key={index} className={index === 0 ? 'bg-primary text-white' : ''}>
									<td className="border px-4 py-2">{team.position + 1}</td>
									<td className="border px-4 py-2">{team.team}</td>
									<td className="border px-4 py-2">{team.points}</td>
								</tr>
							))}
							</tbody>
						</table>
						</div>
					</div>
				</div>

			</div>
		</>
	)
}