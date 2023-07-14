import React from "react";
import Modal from "react-modal";
import GroupPhaseDefinition from "../../../create-tournament/GroupPhaseDefinition";
import PhasesTournamentDefinition from "../../../create-tournament/PhasesTournamentDefinition";
import { Button } from "../../../generic/Button";
import { customStyles } from "./TournamentManager";
import { Tournament } from "../../../../models/Tournament";
import { Phase } from "../../../../models/Phase";

interface Props {
	tournament: Tournament;
	modalIsOpen: boolean;
	closeModal: () => void;
	getQualified: (phase: Phase) => ({
		team: string;
		position: number;
		group: number;
	} | undefined)[] | undefined;
	getEliminated: (phase: Phase) => string[];
	handleCreateLooserTournament: () => void;
	modalLooserTournamentIsOpen: boolean;
	setLooserTournamentIsOpen: (value: boolean) => void;
	looserTournament: Tournament | undefined;
	setLooserTournament: (value: Tournament) => void;
	updatePhase: (value: Phase, index: number) => void;
}

export const TournamentManagerModals: React.FC<Props> = ({ tournament, modalIsOpen, closeModal, getQualified, getEliminated, handleCreateLooserTournament, modalLooserTournamentIsOpen, setLooserTournamentIsOpen, looserTournament, setLooserTournament, updatePhase }) => {
	return (
		<>
			{tournament.phases[tournament.currentPhase + 1] && (
				<Modal
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
					style={customStyles}
					contentLabel="Phase suivante"
					ariaHideApp={false}
				>
					<div className="p-4">
						<h3 className="text-2xl">⚠️ Passage à la phase suivante</h3>
						<p className="mt-2">
							Vous vous apprêtez à passer à la phase suivante, il s'agit d'une
							phase {tournament.phases[tournament.currentPhase + 1].type}
						</p>
						<p>
							Les qualifiés sont :{" "}
							{getQualified(tournament.phases[tournament.currentPhase])!.map(
								(t) => (
									<p className="text-success"> {t!.team}</p>
								)
							)}
						</p>
						<p>
							Les éliminés sont :{" "}
							{getEliminated(tournament.phases[tournament.currentPhase])!.map(
								(t) => (
									<p className="text-danger"> {t}</p>
								)
							)}
						</p>
						<p className="mt-3">Voulez-vous passer à la phase suivante ?</p>
					</div>
					<div className="flex justify-center gap-2">
						<Button color="success" action={handleCreateLooserTournament}>
							Oui
						</Button>
						<Button color="danger" action={closeModal}>
							Non, annuler
						</Button>
					</div>
				</Modal>
			)}

			<Modal
				isOpen={modalLooserTournamentIsOpen}
				onRequestClose={() => setLooserTournamentIsOpen(false)}
				style={customStyles}
				ariaHideApp={false}
			>
				{looserTournament && (
					<>
						{looserTournament.phases.length === 0 && (
							<PhasesTournamentDefinition
								tournament={looserTournament}
								setTournament={setLooserTournament}
								setIsValid={() => true} />
						)}
						{looserTournament.phases.map(
							(p, index) => p.type === "Poules" && (
								<GroupPhaseDefinition
									phase={p}
									updatePhase={updatePhase}
									index={index}
									setIsValid={() => true} />
							)
						)}

						<div className="flex justify-center gap-2">
							{/*{looserTournament.phases.length > 0 && <Button text="Oui, créer un tournoi" color="success" action={handleSaveLooserTournament} />}*/}
							<Button
								color="danger"
								action={() => setLooserTournamentIsOpen(false)}
							>
								Annuler
							</Button>
						</div>
					</>
				)}
			</Modal>
		</>
	);
};
