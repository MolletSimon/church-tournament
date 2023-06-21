import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import {collection, getDocs, Timestamp} from "firebase/firestore";
import {db} from "../../index";
import Loader from "../Common/Loader";
import {Tournament} from "../../models/Tournament";

export const Admin: React.FC = () => {
	const [tournaments, setTournaments] = useState<Tournament[]>([]);
	const navigate = useNavigate();

	const fetchTournaments = async () => {

		await getDocs(collection(db, "tournaments"))
			.then((querySnapshot)=>{
				let dataTournaments = querySnapshot.docs
					.map((doc) => ({
						...doc.data(),
					})) as Tournament[];
				dataTournaments = dataTournaments.map((tournament) => ({
					...tournament,
					dateTournament : (tournament.dateTournament as unknown as Timestamp)?.toDate()
				}))

				setTournaments(dataTournaments);
			})
	}

	const handleClick = (tournament: Tournament) => {
		navigate(`/tournament/${tournament.id}`)
	}

	useEffect(() => {
		if (localStorage.getItem("connected")) {
			fetchTournaments()
		} else {
			navigate("/login")
		}

	}, []);

	return (
		<>
			<h1 className="text-3xl font-bold m-8">Page administrateur</h1>
			<div className="flex flex-row m-8">
				<button
					id="createTournament"
					className="bg-success hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:transition-all focus:outline-none focus:shadow-outline"
					onClick={() => navigate("/create-tournament")}
				>
					Créer un tournoi
				</button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

				{tournaments ? tournaments.map((t) => (
					<div
						key={t.id}
						id={t.name}
						onClick={() => handleClick(t)}
						className="bg-gray-100 p-4 rounded-md flex flex-col justify-center items-center shadow-lg m-8 cursor-pointer hover:scale-110 transform transition-all"
					>
						<h3 className="text-lg font-bold mb-2 text-primary">{t.name}</h3>
						<p>{t.dateTournament?.toLocaleDateString()}</p>

						<p className="text-lg mb-2">Nombre d'équipes : {t.numberTeams}</p>
						<span className={`text-sm font-semibold uppercase mt-2 py-1 px-2 rounded ${t.status === 'init' ? 'bg-warning text-white' : t.status === 'started' ? 'bg-primary text-white' : 'bg-primary text-white'}`}>
							{t.status === 'init' && <p>Initié</p>}
							{t.status === 'drawMade' && <p>TAS Effectué - Prêt à lancer</p>}
							{t.status === 'started' && <p>Démarré</p>}
						  </span>
					</div>
				)) : <Loader/>}
			</div>
		</>

	);
};
