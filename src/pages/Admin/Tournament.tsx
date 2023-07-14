import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import 'firebase/firestore';
import {doc, getDoc, setDoc, Timestamp} from 'firebase/firestore'
import MakeDraw from "../../components/tournament/admin/DrawMaker";
import {TournamentManager} from "../../components/tournament/admin/TournamentManager";
import { db } from '../..';
import RecapTournament from '../../components/create-tournament/RecapTournament';
import { Button } from '../../components/generic/Button';
import { Tournament } from '../../models/Tournament';

export const TournamentPage: React.FC = () => {
	const { id } = useParams();
	const [tournament, setTournament] = useState<Tournament | null>(null);
	const [drawMode, setDrawMode] = useState(false);
	const [launched, setLaunched] = useState(false);
	const navigate = useNavigate();

	const fetchTournament = async () => {
		const docRef = doc(db, "tournaments", id!);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const tournamentData = docSnap.data() as Tournament;
			if (tournamentData.status === "started") setLaunched(true);
			const date = tournamentData.dateTournament as unknown as Timestamp;
			setTournament({...tournamentData, dateTournament: date.toDate()})
		} else {
			console.log("No such document!");
		}
	}

	const handleStartTournament = async () => {
		const newTournament: Tournament = {...tournament!, status: "started"}
		setTournament(newTournament);
		await setDoc(doc(db, "tournaments", tournament?.id!), newTournament);
		setLaunched(true);
	};

	const handleDraw = () => {
		setDrawMode(true)
	};

	const handleDeleteTournament = () => {
		// Code pour supprimer le tournoi ici...
	};

	const handleBack = () => {
		navigate("/")
	}

	useEffect(() => {
		if(id) fetchTournament()
	}, [id]);

	return (
		<>
			{tournament && !drawMode && !launched && (
				<div className="mt-10 ml-36 mr-36">
					<RecapTournament tournament={tournament} />
					<div className="flex justify-end space-x-4 py-4">

						<Button  color="primary" action={handleBack}>Retour</Button>
						<Button  color="warning" hoverColor="green-600" action={handleStartTournament} disabled={tournament.status !== 'drawMade'} >Lancer le tournoi</Button>
						<Button  color="success" action={handleDraw} hoverColor='green-600' disabled={tournament.status !== 'init'} >Effectuer le tirage au sort</Button>
						<Button  color="danger" action={handleDeleteTournament} hoverColor='red-600' >Supprimer le tournoi</Button>
					</div>
				</div>
			) }

			{drawMode && <MakeDraw tournament={tournament!} setTournament={setTournament} setDrawMode={setDrawMode} />}

			{tournament && launched && (
				<TournamentManager tournament={tournament} setTournament={setTournament} />
			)}
		</>
	);
};