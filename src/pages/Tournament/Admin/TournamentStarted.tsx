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
import {Phase} from "../../../models/Phase";
import PhasesTournamentDefinition from "../../Admin/CreationTournament/PhasesTournamentDefinition";
import GroupPhaseDefinition from "../../Admin/CreationTournament/GroupPhaseDefinition";
import {toast, ToastContainer} from "react-toastify";
import {Link} from "react-router-dom";

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
	const tournamentService = new TournamentService();
	const [modalIsOpen, setIsOpen] = React.useState(false);
	const [modalLooserTournamentIsOpen, setLooserTournamentIsOpen] = React.useState(false);
	const [looserTournament, setLooserTournament] = useState<Tournament>();

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	const handleNextPhase = async () => {
		const previousPhase = tournament.phases[tournament.currentPhase];
		const qualified = previousPhase.groups?.map((g, indexG) => g.ranking?.slice(0, previousPhase.numberQualifiedByGroup)
			.map(r => {
				return {team: r.team, position: r.position, group: indexG}
			})).flat();
		const phase = tournament.phases[1];
		const teams = qualified!.map(q => q!.team);
		const teamsPerGroup = Math.ceil(qualified!.length / phase.numberGroups);
		const groups: string[][] = Array.from({length: phase.numberGroups}, () => []);
		for (let i = 0; i < phase.numberGroups; i++) {
			const group = groups[i];
			while (group.length < teamsPerGroup && teams.length > 0) {
				group.push(teams.shift()!);
			}
			if (i > 0) {
				const previousGroup = previousPhase.groups![i - 1];
				const previousBestTeam = previousGroup.ranking![0].team;
				while (previousGroup.ranking!.length > 0 && teams.length > 0) {
					const index = teams.findIndex(t => t === previousBestTeam);
					if (index !== -1) {
						const teamToMove = teams.splice(index, 1)[0];
						group.push(teamToMove);
						previousGroup.ranking!.shift();
					} else {
						break;
					}
				}
			}
		}
		let newPhases = tournamentService.GeneratePhase({...tournament, currentPhase: 1}, groups);
		const tournamentToSave = {...tournament, phases: newPhases, currentPhase: tournament.currentPhase + 1}
		setTournament(tournamentToSave);
		try {
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
			status: "init",
			numberTeams: getEliminated(tournament.phases[tournament.currentPhase]).length,
			teams: getEliminated(tournament.phases[tournament.currentPhase]),
			phases: [] as Phase[]
		} as Tournament;

		setLooserTournament(lTournament);
		setLooserTournamentIsOpen(true);
	};

	const CustomToastWithLink = () => (
		<div>
			<p>Votre tournoi a bien été créé ! Il s'est ouvert dans un nouvel onglet.</p>
		</div>
	);

	const handleSaveLooserTournament = async () => {
		try {
			const docRef = await addDoc(collection(db, "tournaments"), looserTournament);
			await setDoc(doc(db, "tournaments", docRef.id), {...looserTournament, id: docRef.id});
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
			window.open(`/tournament/${docRef.id}`,'', 'rel=noopener noreferrer')
			handleNextPhase();
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	};

	return (
		<>
			<Modal
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
					<p className="mt-3">Voulez-vous créer un tournoi avec les équipes qui ont étés éliminés ?</p>
				</div>
				<div className="flex justify-center gap-2">
					<Button text="Oui, créer un tournoi" color="success" action={handleCreateLooserTournament} />
					<Button text="Non, passer à la phase suivante" color="warning" action={handleNextPhase} />
					<Button text="Non, annuler" color="danger" action={closeModal} />
				</div>

			</Modal>
			<Modal isOpen={modalLooserTournamentIsOpen} onRequestClose={() => setLooserTournamentIsOpen(false)} style={customStyles} ariaHideApp={false}>
				{looserTournament && <>
					{looserTournament.phases.length === 0 &&
						<PhasesTournamentDefinition tournament={looserTournament} setTournament={setLooserTournament} setIsValid={() => true} />
					}
					{looserTournament.phases.map((p,index) => p.type === "Poules" && <GroupPhaseDefinition phase={p} updatePhase={updatePhase} index={index} setIsValid={() => true} />)}

					<div className="flex justify-center gap-2">
						<Button text="Oui, créer un tournoi" color="success" action={handleSaveLooserTournament} />
						<Button text="Annuler" color="danger" action={() => setLooserTournamentIsOpen(false)} />
					</div>
				</>}
			</Modal>
			{tournament.phases[tournament.currentPhase].type === "Poules" ? <GroupPhase handleNextPhase={openModal} tournament={tournament} setTournament={setTournament} /> : <></>}
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