/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import 'firebase/firestore';
import {doc, setDoc} from 'firebase/firestore'
import MakeDraw from "../../components/tournament/admin/manager/DrawMaker";
import {TournamentManager} from "../../components/tournament/admin/manager/TournamentManager";
import { db } from '../..';
import RecapTournament from '../../components/create-tournament/RecapTournament';
import { Button } from '../../components/generic/Button';
import { Tournament } from '../../models/Tournament';
import { TournamentService } from '../../services/TournamentService';

export const TournamentPage: React.FC = () => {
	const { id } = useParams();
	const [tournament, setTournament] = useState<Tournament | null>(null);
	const tournamentService = new TournamentService();
	const [drawMode, setDrawMode] = useState(false);
	const [launched, setLaunched] = useState(false);
	const navigate = useNavigate();

	const handleStartTournament = async () => {
		const newTournament: Tournament = {...tournament!, status: "started"}
		setTournament(newTournament);
		await setDoc(doc(db, "tournaments", tournament?.id!), newTournament);
		setLaunched(true);
	};

	const handleDraw = () => {
		setDrawMode(true)
	};

	const handleBack = () => {
		navigate("/")
	}

	useEffect(() => {
		if(id) {
			tournamentService.FetchTournament(id).then((data) => {
				setTournament(() => {
					if (data.status === "started") setLaunched(true);
					return data
				});		
			});
		}
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
						{/* <Button  color="danger" action={handleDeleteTournament} hoverColor='red-600' >Supprimer le tournoi</Button> */}
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