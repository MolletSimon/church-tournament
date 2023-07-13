import {useNavigate} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import {addDoc, collection, doc, getDocs, setDoc, Timestamp} from "firebase/firestore";
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
			<div className="flex gap-6 justify-between m-12">
				<div className="flex items-center">
					<img src="/images/logo.png" className="rounded-full bg-primary p-4" alt="logo" width={120}/>
					<h1 className="uppercase text-6xl ml-8 tracking-widest font-bold text-primary font-lexend">Pied ballon</h1>
				</div>
				<div className="flex items-center gap-4 rounded-full border-2 px-8 border-primary">
					<span className="bg-primary rounded-full p-4 text-white text-lg font-bold">SM</span>
					<p className="italic text-lg">Simon M.</p>
				</div>
			</div>
			<div className="flex flex-row my-8 mx-20">
				<button
					id="createTournament"
					className="bg-primary hover:bg-green-600 mt-4 text-white font-bold py-2 px-4 rounded-full delay-100 hover:scale-105 transition-all focus:outline-none focus:shadow-outline"
					onClick={() => navigate("/create-tournament")}
				>
					Créer un tournoi
				</button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-16 gap-6">
				{tournaments ? tournaments.map((t) => (
					<div
						key={t.id}
						id={t.name}
						onClick={() => handleClick(t)}
						className="bg-gray-100 p-6 rounded-xl flex flex-col justify-center items-center shadow-lg cursor-pointer hover:scale-110 transform transition-all"
					>
						<h3 className="text-xl font-bold mb-2 text-primary">{t.name}</h3>
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
