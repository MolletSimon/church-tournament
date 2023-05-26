import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import 'firebase/firestore';
import {db} from "../../../index";
import {doc, getDoc, setDoc, Timestamp} from 'firebase/firestore'
import {Tournament} from "../../../models/Tournament";
import RecapTournament from '../../Admin/CreationTournament/RecapTournament';
import MakeDraw from "./MakeDraw";
import {Button} from "../../../components/generic/Button";
import {TournamentStarted} from "./TournamentStarted";

export const TournamentDetails: React.FC = () => {
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
		await setDoc(doc(db, "tournaments", tournament?.id!),{...tournament, status: "started"});
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

						<Button text="Retour" color="primary" action={handleBack}/>

						<Button text="Lancer le tournoi" color="warning" hoverColor="green-600" action={handleStartTournament} disabled={tournament.status !== 'drawMade'} />
						<Button text="Effectuer le tirage au sort" color="success" action={handleDraw} hoverColor='green-600' disabled={tournament.status !== 'init'} />
						<Button text="Supprimer le tournoi" color="danger" action={handleDeleteTournament} hoverColor='red-600' />
					</div>
				</div>
			) }

			{drawMode && <MakeDraw tournament={tournament!} setTournament={setTournament} setDrawMode={setDrawMode} />}

			{tournament && launched && (
				<TournamentStarted tournament={tournament} setTournament={setTournament} />
			)}
		</>
	);
};