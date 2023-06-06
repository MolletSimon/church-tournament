import { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {Match} from "../../../models/Match";
import {Tournament} from "../../../models/Tournament";
import {db} from "../../../index";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaFutbol, FaMapMarkerAlt } from "react-icons/fa";
import {Button} from "../../../components/generic/Button";

type TeamMatch = {
	match: Match;
	isUpcoming: boolean;
};

const TeamPage = () => {
	const { tournamentId, teamName } = useParams<{ tournamentId: string; teamName: string }>();
	const [tournament, setTournament] = useState<Tournament>();
	const [teamMatches, setTeamMatches] = useState<TeamMatch[]>([]);

	useEffect(() => {
		const fetchTournament = async () => {
			if (tournamentId != null) {
				const docRef = doc(db, "tournaments", tournamentId);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					setTournament(docSnap.data() as Tournament);
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
		return match.winner === 'Aucun' ? 'text-warning' : match.winner === teamName ? 'text-green-600' : 'text-danger';
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className=" py-6 mb-4 flex justify-center items-center">
				<FaFutbol className="text-primary text-4xl mr-2" />
				<h1 className="text-primary text-center font-bold text-3xl">{teamName}</h1>
			</div>
			<div className="px-4">
				{teamMatches.length > 0 ? (
					<div className="grid grid-cols-1 gap-4">
						{teamMatches.map(({ match, isUpcoming }) => (
							<div
								key={`${match.teams[0]}-${match.teams[1]}`}
								className="bg-white rounded-lg shadow-lg px-4 py-4 text-gray-800"
							>
								<div className="grid grid-cols-3 py-2">
									<div className="text-xl">{match.teams[0]}</div>
									<div className={`text-center text-2xl font-bold ${teamResult(match)}`}>
										{match.score1 !== undefined && match.score2 !== undefined
											? `${match.score1} - ${match.score2}`
											: "-"}
									</div>
									<div className="text-right text-xl">{match.teams[1]}</div>
								</div>
								<div className="flex justify-between items-center mt-4">
									<div className="flex items-center text-sm">
										<AiOutlineClockCircle className="text-gray-500 mr-2" />
										{isUpcoming ? (
											<>
												<span className="font-bold">Heure:</span> {match.hour || "-"}
											</>
										) : (
											<>
												<span className="font-bold">Résultat:</span>{" "}
												{match.winner ? `${match.winner} gagne` : "Match nul"}
											</>
										)}
									</div>
									{isUpcoming && (
										<div className="flex items-center text-sm">
											<FaMapMarkerAlt className="text-gray-500 mr-2" />
											<span className="font-bold">Terrain:</span> {match.field || "-"}
										</div>
									)}
								</div>
							</div>
						))}
						<div className="flex justify-center mt-8">
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