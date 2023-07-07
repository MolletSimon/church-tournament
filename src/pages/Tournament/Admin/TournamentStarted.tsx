import React, {useState} from "react";
import {Tournament} from "../../../models/Tournament";
import {GroupPhase} from "./GroupPhase";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {Group} from "../../../models/Group";
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import {TournamentService} from "../../../services/TournamentService";
import {Button} from "../../../components/generic/Button";
import {addDoc, collection, doc, setDoc} from "firebase/firestore";
import {db} from "../../../index";
import {Knockout, Phase} from "../../../models/Phase";
import PhasesTournamentDefinition from "../../Admin/CreationTournament/PhasesTournamentDefinition";
import GroupPhaseDefinition from "../../Admin/CreationTournament/GroupPhaseDefinition";
import {toast, ToastContainer} from "react-toastify";
import {Link} from "react-router-dom";
import * as tls from "tls";
import knockoutPhase from "./KnockoutPhase";
import {Match, MatchKnockout} from "../../../models/Match";
import KnockoutPhase from "./KnockoutPhase";
import KnockoutTree from "./KnockoutPhase";
import {PhaseService} from "../../../services/PhaseService";

interface Props {
	tournament: Tournament,
	setTournament: (value: Tournament) => void;
}

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

export const TournamentStarted:React.FC<Props>  = ({tournament, setTournament}) => {
	const [modalIsOpen, setIsOpen] = React.useState(false);
	const [modalLooserTournamentIsOpen, setLooserTournamentIsOpen] = React.useState(false);
	const [looserTournament, setLooserTournament] = useState<Tournament>();

	const openModal = () => {


		setIsOpen(true);
	}

	const closeModal = () => {
		setIsOpen(false);
	}

	const handleNextPhase = async (idLooserTournament?: string) => {
		const phaseService = new PhaseService();
		const previousPhase = tournament.phases[tournament.currentPhase];
		let qualified = previousPhase.groups?.map((g, indexG) => g.ranking?.slice(0, previousPhase.numberQualifiedByGroup)
			.map(r => {
				return {team: r.team, position: r.position, group: indexG}
			})).flat();
		const phase = tournament.phases[tournament.currentPhase + 1];
		const teams = qualified!.map(q => q!.team);
		let newPhases = [] as Phase[];
		if (phase.type === "Poules") {
			newPhases = phaseService.GenerateGroupPhase(phase, tournament, qualified);
		} else {
			newPhases = phaseService.GenerateKnockoutPhase(tournament, teams, qualified);
		}

		const tournamentToSave = {...tournament, phases: newPhases, currentPhase: tournament.currentPhase + 1}
		setTournament(tournamentToSave);
		try {
			if(idLooserTournament) tournamentToSave.looserTournament = idLooserTournament
			await setDoc(doc(db, "tournaments", tournament.id!), {...tournamentToSave});
		} catch (e) {
			console.error("Error adding document: ", e);
		}
		setIsOpen(false);
	}



	const getQualified = (phase: Phase) => {
		return phase.groups?.map((g, indexG) => g.ranking?.slice(0, phase.numberQualifiedByGroup)
			.map(r => {
				return {team: r.team, position: r.position, group: indexG}
			})).flat();
	}

	const getEliminated = (phase: Phase) => {
		const qualified = getQualified(tournament.phases[tournament.currentPhase])?.map(q => q!.team)!;
		return tournament.teams.filter((item) => !qualified.includes(item));
	}

	const updatePhase = (phase: Phase, index: number) => {
		if(looserTournament) {
			looserTournament.phases[index] = phase;
			setLooserTournament({...looserTournament});
		}
	};

	const handleCreateLooserTournament = async () => {
		const lTournament = {
			currentPhase: 0,
			name: tournament.name + " - Consolante",
			dateTournament: tournament.dateTournament,
			status: "started",
			numberTeams: getEliminated(tournament.phases[tournament.currentPhase]).length,
			teams: getEliminated(tournament.phases[tournament.currentPhase]),
			phases: [
				{
					type: "Poules",
					name: "Poules",
					numberGroups: 2,
					isHomeAndAway: false,
					numberTeamsByGroup: 4,
					numberQualifiedByGroup: 2
				},
				{
					type: "Elimination directe",
					name: "Phases finales"
				}
			] as Phase[]
		} as Tournament;

		const tournamentService = new TournamentService();
		lTournament.phases = tournamentService.GeneratePhase(lTournament, [
			getEliminated(tournament.phases[tournament.currentPhase]).slice(0,4), getEliminated(tournament.phases[tournament.currentPhase]).slice(4,8)
		])
		console.log(lTournament)

		setLooserTournament(lTournament);
		await handleSaveLooserTournament(lTournament)
		/*setLooserTournamentIsOpen(true);*/
	};

	const CustomToastWithLink = () => (
		<div>
			<p>Votre tournoi a bien été créé ! Il s'est ouvert dans un nouvel onglet.</p>
		</div>
	);

	const handleSaveLooserTournament = async (lTournament: Tournament) => {
		try {
			if (tournament.currentPhase === 0) {
				const docRef = await addDoc(collection(db, "tournaments"), lTournament);
				await setDoc(doc(db, "tournaments", docRef.id), {...lTournament, id: docRef.id})
				setLooserTournamentIsOpen(false);
				toast.success(CustomToastWithLink, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
				});
				window.open(`/tournament/${docRef.id}`,'_blank', 'noreferrer')
				await handleNextPhase(docRef.id);
			} else {
				await handleNextPhase();
			}

		} catch (e) {
			console.error("Error adding document: ", e);
		}
	};

	return (
		<>
			{/* MODAL */}
			{tournament.phases[tournament.currentPhase + 1] && <Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel="Phase suivante"
				ariaHideApp={false}
			>
				<div className="p-4">
					<h3 className="text-2xl">⚠️ Passage à la phase suivante</h3>
					<p className="mt-2">Vous vous apprêtez à passer à la phase suivante, il s'agit d'une phase {tournament.phases[tournament.currentPhase + 1].type}</p>
					<p>Les qualifiés sont : {getQualified(tournament.phases[tournament.currentPhase])!.map(t =>
						<p className="text-success"> {t!.team}</p>)}
					</p>
					<p>Les éliminés sont : {getEliminated(tournament.phases[tournament.currentPhase])!.map(t =>
						<p className="text-danger"> {t}</p>)}</p>
					<p className="mt-3">Voulez-vous passer à la phase suivante ?</p>
				</div>
				<div className="flex justify-center gap-2">
					<Button text="Oui" color="success" action={handleCreateLooserTournament} />
					<Button text="Non, annuler" color="danger" action={closeModal} />
				</div>

			</Modal>}

			<Modal isOpen={modalLooserTournamentIsOpen} onRequestClose={() => setLooserTournamentIsOpen(false)} style={customStyles} ariaHideApp={false}>
				{looserTournament && <>
					{looserTournament.phases.length === 0 &&
						<PhasesTournamentDefinition tournament={looserTournament} setTournament={setLooserTournament} setIsValid={() => true} />
					}
					{looserTournament.phases.map((p,index) => p.type === "Poules" && <GroupPhaseDefinition phase={p} updatePhase={updatePhase} index={index} setIsValid={() => true} />)}

					<div className="flex justify-center gap-2">
						{/*{looserTournament.phases.length > 0 && <Button text="Oui, créer un tournoi" color="success" action={handleSaveLooserTournament} />}*/}
						<Button text="Annuler" color="danger" action={() => setLooserTournamentIsOpen(false)} />
					</div>
				</>}
			</Modal>


			<div className="flex justify-between mt-8 px-4 sm:px-0 sm:mx-20">
				<h1 className="font-bold text-primary text-3xl self-center">
					{tournament.name} - Phase : {tournament.phases[tournament.currentPhase]?.name}
				</h1>
				<Link to={`historique`}>
					<Button text="Historique" color="primary" />
				</Link>
			</div>
			{tournament.phases[tournament.currentPhase]?.type === "Poules" ?
				<GroupPhase handleNextPhase={openModal} tournament={tournament} setTournament={setTournament} /> :
				<KnockoutPhase setTournament={setTournament} tournament={tournament} />}
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</>
	)
}