import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import {db} from "../../index";
import Loader from "../Common/Loader";
import {TournamentFromFirestore} from "../../models/TournamentData";

interface TournamentData {
	id: string,
	tournament: TournamentFromFirestore
}

export const Admin: React.FC = () => {
	const [tournaments, setTournaments] = useState<TournamentData[]>([]);
	const navigate = useNavigate();

	const fetchTournaments = async () => {

		await getDocs(collection(db, "tournaments"))
			.then((querySnapshot)=>{
				const dataTournaments = querySnapshot.docs
					.map((doc) => ({
						id: doc.id,
						...doc.data(),
					})) as TournamentData[];
				setTournaments(dataTournaments);
			})

	}

	const handleClick = (tournament: TournamentData) => {
		navigate(`/tournament/${tournament.id}`)
	}

	useEffect(() => {
		fetchTournaments()
	}, [tournaments]);

	return (
		<>
			<h1 className="text-3xl font-bold m-8">Page administrateur</h1>
			<div className="flex flex-row m-8">
				<button
					className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					onClick={() => navigate("/create-tournament")}
				>
					Créer un tournoi
				</button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

				{tournaments ? tournaments.map((t) => (
					<div
						key={t.tournament.id}
						onClick={() => handleClick(t)}
						className="bg-gray-100 p-4 rounded-md flex flex-col justify-center items-center shadow-lg m-8 cursor-pointer hover:scale-110 transform"
					>
						<h3 className="text-lg font-bold mb-2 text-blue-500">{t.tournament.name}</h3>
						<p className="text-lg mb-2">Nombre d'équipes : {t.tournament.numberTeams}</p>
						<p>{t.tournament.dateTournament?.toDate().toLocaleDateString()}</p>
					</div>
				)) : <Loader/>}
			</div>
		</>

	);
};
