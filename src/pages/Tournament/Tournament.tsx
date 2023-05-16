import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import 'firebase/firestore';
import {db} from "../../index";
import {doc, getDoc} from 'firebase/firestore'
import {Tournament} from "../../models/Tournament";
import RecapTournament from '../Admin/CreationTournament/RecapTournament';
import {TournamentService} from "../../services/TournamentService";
import Loader from "../Common/Loader";
import {TournamentFromFirestore} from "../../models/TournamentData";
import MakeDraw from "./MakeDraw";

export const TournamentDetails: React.FC = () => {
	const { id } = useParams();
	const [tournament, setTournament] = useState<Tournament | null>(null);
	const [drawMode, setDrawMode] = useState(false);

	const fetchTournament = async () => {
		const docRef = doc(db, "tournaments", id!);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const tournamentData = docSnap.data()["tournament"] as TournamentFromFirestore;
			setTournament(TournamentService.ConvertTournamentFromTournamentData(tournamentData))
		} else {
			console.log("No such document!");
		}
	}

	const handleStartTournament = () => {
		// Code pour lancer le tournoi ici...
	};

	const handleDraw = () => {
		// Code pour effectuer le tirage au sort ici...
		setDrawMode(true)
	};

	const handleDeleteTournament = () => {
		// Code pour supprimer le tournoi ici...
	};

	useEffect(() => {
		if(id) fetchTournament()
	}, [id]);

	return (
		<>
			{tournament && !drawMode && (
				<div className="mt-10 ml-36 mr-36">
					<RecapTournament tournament={tournament} />
					<div className="flex justify-end space-x-4 py-4">
						<button
							onClick={handleStartTournament}
							disabled={!tournament.isDrawDone}
							className="px-4 py-2 text-white bg-blue-500 rounded-md disabled:bg-gray-400 hover:bg-blue-600"
						>
							Lancer le tournoi
						</button>
						<button
							onClick={handleDraw}
							className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
						>
							Effectuer le tirage au sort
						</button>
						<button
							onClick={handleDeleteTournament}
							className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
						>
							Supprimer le tournoi
						</button>
					</div>
				</div>
			) }

			{drawMode && <MakeDraw tournament={tournament!} />}
		</>
	);
};