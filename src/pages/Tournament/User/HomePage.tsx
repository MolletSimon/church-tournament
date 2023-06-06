import { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {Tournament} from "../../../models/Tournament";
import {db} from "../../../index";
import { FaUserFriends, FaRegFutbol, FaUsers } from "react-icons/fa";
import { MdGroup } from "react-icons/md";


const HomePage = () => {
	const { tournamentId } = useParams<{ tournamentId: string }>();
	const navigate = useNavigate();
	const [tournament, setTournament] = useState<Tournament>();
	const [selectedTab, setSelectedTab] = useState<"teams" | "groups">("teams");

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

	const handleClickTeam = (teamName: string) => {
		navigate(`/${tournamentId}/${teamName}`)
	}

	const handleClickGroup = (groupId: number) => {
		navigate(`/${tournamentId}/group/${groupId.toString()}`)
	}

	const groups = tournament?.phases[tournament.currentPhase].groups || [];

	return (
		<div className="min-h-screen bg-gray-100">
		<div className="text-primary py-4 mb-4 mt-2">
			<h1 className="text-3xl text-center font-bold">
				{tournament?.name}
			</h1>
		</div>
		<div className="flex justify-center py-2 mb-2">
			<button
				className={`${
					selectedTab === "teams"
						? "bg-primary text-white"
						: "bg-white text-primary"
				} px-4 py-2 rounded-l-md focus:outline-none flex items-center transition-colors duration-200`}
				onClick={() => setSelectedTab("teams")}
			>
				<FaUserFriends className="mr-2" />
				Équipes
			</button>
			<button
				className={`${
					selectedTab === "groups"
						? "bg-primary text-white"
						: "bg-white text-primary"
				} px-4 py-2 rounded-r-md focus:outline-none flex items-center transition-colors duration-200`}
				onClick={() => setSelectedTab("groups")}
			>
				<FaRegFutbol className="mr-2" />
				Groupes
			</button>
		</div>
		<div className="px-4">
			{selectedTab === "teams" && (
				<div className="grid grid-cols-1 gap-4 mb-4">
					{tournament?.teams.map((team) => (
						<div
							key={team}
							className="bg-white rounded-lg shadow-lg text-lg px-4 py-6 text-primary cursor-pointer hover:shadow-2xl transition-shadow duration-200"
							onClick={() => handleClickTeam(team)}
						>
							<div className="flex items-center gap-4">
								<FaUsers className="text-2xl text-gray-500 mr-2" />
								<h2 className="font-bold text-2xl">{team}</h2>
							</div>
						</div>
					))}
				</div>

			)}
			{selectedTab === "groups" && (
				<div className="grid grid-cols-1 gap-4">
					{groups.map((group, index) => (
						<div
							key={index}
							className="bg-white rounded-lg shadow-lg px-4 py-2 text-gray-800 cursor-pointer hover:shadow-2xl transition-shadow duration-200"
							onClick={() => handleClickGroup(index)}
						>
							<div className="flex justify-between items-center mb-2">
								<h2 className="font-bold text-2xl text-primary">
									Poule {index + 1}
								</h2>
								<MdGroup className="text-2xl text-gray-500" />
							</div>
							<div className="grid grid-cols-1 gap-2">
								{group.teams.map((team, teamIndex) => (
									<div
										key={team}
										className={`bg-gray-${
											teamIndex % 2 === 0 ? "50" : "100"
										} rounded-md px-2 py-1`}
									>
										<div className="flex items-center">
											<FaUsers className="text-lg text-gray-500 mr-2" />
											<div className="text-base text-gray-800">{team}</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	</div>
	);
};

export default HomePage;