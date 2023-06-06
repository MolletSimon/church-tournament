import { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { FaFutbol, FaTrophy } from "react-icons/fa";
import { IoMdFootball } from "react-icons/io";
import {Group} from "../../../models/Group";
import {Match} from "../../../models/Match";
import {db} from "../../../index";
import {Tournament} from "../../../models/Tournament";
import {Button} from "../../../components/generic/Button";

const GroupPage = () => {
	const { tournamentId, groupId } = useParams<{ tournamentId: string; groupId: string }>();
	const [group, setGroup] = useState<Group>();
	const [teamMatches, setTeamMatches] = useState<Match[]>([]);
	const [tournament, setTournament] = useState<Tournament>();
	const [allMatches, setAllMatches] = useState<Match[]>([]);
	const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>();

	useEffect(() => {
		const fetchTournament = async () => {
			if (tournamentId != null) {
				const docRef = doc(db, "tournaments", tournamentId);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const tournamentData = docSnap.data() as Tournament;
					setTournament(tournamentData)
					setCurrentPhaseIndex(tournamentData.currentPhase);
				} else {
					console.log("No such document!");
				}
			}
		};

		fetchTournament();
	}, [tournamentId]);

	useEffect(() => {
		const fetchGroup = async () => {
			if (currentPhaseIndex !== undefined) {
				if (tournament) {
					const group = tournament.phases[currentPhaseIndex].groups?.find((group, index) => index.toString() === groupId);
					setGroup(group);
					setAllMatches(group?.matches || []);
				} else {
					console.log("No such document!");
				}
			}
		};

		fetchGroup();
	}, [tournamentId, groupId, currentPhaseIndex]);

	useEffect(() => {
		if (group) {
			const teamMatches = allMatches.filter(match => group.teams.includes(match.teams[0]) || group.teams.includes(match.teams[1]));
			setTeamMatches(teamMatches);
		}
	}, [group, allMatches]);

	const isTeamQualified = (index: number) => {
		return index < tournament?.phases![tournament?.currentPhase]!.numberQualifiedByGroup! ? 'text-green-600' : ''
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="py-2 flex justify-center items-center">
				<FaFutbol className="text-primary text-3xl mr-2" />
				<h1 className="text-primary text-center py-4 font-bold text-2xl">
					Groupe {parseInt(groupId!) + 1}
				</h1>
			</div>
			<div className="px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
					<div className="bg-white rounded-md shadow-md px-4 py-2 text-gray-800">
						<h2 className="text-lg font-bold mb-2 flex items-center">
							<FaTrophy className="text-primary text-xl mr-2"/>
							Classement
						</h2>
						{group?.ranking ? (
							<table className="w-full">
								<thead>
								<tr>
									<th className="text-left py-2">Position</th>
									<th className="text-left py-2">Equipe</th>
									<th className="text-right py-2">Pts</th>
									<th className="text-right py-2">+/-</th>
								</tr>
								</thead>
								<tbody>
								{group.ranking.map((teamRanking, index) => (
									<tr key={teamRanking.team} className={`${isTeamQualified(index)} ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}>
										<td className="py-2 pl-4">{teamRanking.position}</td>
										<td className="py-2">{teamRanking.team}</td>
										<td className="text-right py-2">{teamRanking.points}</td>
										<td className="text-right py-2 pr-4">
											{teamRanking.goalScored-teamRanking.goalTaken}
										</td>
									</tr>
								))}
								</tbody>
							</table>
						) : (
							<p>Pas encore de classement.</p>
						)}
					</div>
					<div className="bg-white rounded-md shadow-md px-4 py-2 text-gray-800">
						<h2 className="text-lg font-bold mb-2 flex items-center">
							<IoMdFootball className="text-primary text-xl mr-2" />
							Matchs
						</h2>
						{group?.matches?.length! > 0 ? (
							<table className="w-full">
								<thead>
								<tr>
									<th className="text-left py-2">Equipe 1</th>
									<th className="text-center py-2">Score</th>
									<th className="text-right py-2">Equipe 2</th>
								</tr>
								</thead>
								<tbody>
								{group!.matches.map((match) => (
									<tr key={`${match.teams[0]}-${match.teams[1]}`}>
										<td className="py-2">{match.teams[0]}</td>
										<td className="text-center py-2">
											{match.winner ? `${match.score1}-${match.score2}` : "-"}
										</td>
										<td className="text-right py-2">{match.teams[1]}</td>
									</tr>
								))}
								</tbody>
							</table>
						) : (
							<p>Pas de matchs pour le moment.</p>
						)}
					</div>
				</div>
			</div>
			<div className="flex justify-center mt-8">
				<Link to="/">
					<Button
						text="Retour"
						color="danger"
						hoverColor="red-600"
					/>
				</Link>
			</div>
		</div>
	);
};

export default GroupPage;