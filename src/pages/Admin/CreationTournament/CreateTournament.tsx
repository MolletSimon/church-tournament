import React, { useState} from "react";
import {Phase, Tournament} from "../../../models/Tournament";
import {TournamentDefinition} from "./TournamentDefinition";
import {TeamsDefinition} from "./TeamsDefinition";
import RecapTournament from "./RecapTournament";
import PoulesPhase from "./PoulesPhase";
import PhasesTournamentDefinition from "./PhasesTournamentDefinition";

export const CreateTournament = () => {
	const [tournament, setTournament] = useState({teams: [], phases: []} as Tournament);
	const [step, setStep] = useState(1);
	const [isValid, setIsValid] = useState(false);

	const updatePhase = (phase: Phase, index: number) => {
		tournament.phases[index] = phase;
		setTournament({...tournament})
	}

	const handleNextStep = () => {
		if (isValid) {
			setStep(step+1);
			setIsValid(false);
		}
	}

	return (
		<div className="m-5 p-5">
			<div className="flex flex-row">
				<div className="w-2/3 p-4 pr-8">
					<h1 className="text-3xl text-blue-500 font-bold mb-4">Création d'un tournoi ⚽️</h1>
					{step === 1 && (
						<TournamentDefinition setIsValid={setIsValid} tournament={tournament} setTournament={setTournament} />
					)}
					{step === 2 && (
						<TeamsDefinition setIsValid={setIsValid} setTournament={setTournament} tournament={tournament} />
					)}
					{step === 3 && (
						<PhasesTournamentDefinition setIsValid={setIsValid} tournament={tournament} setTournament={setTournament} />
					)}
					{step === 4 && (
						<>
							<h2 className="text-xl font-bold mb-4">Phases de poules</h2>
							{tournament.phases?.map((p, index) => (
								<>
									{p.type === 'Poules' && <PoulesPhase setIsValid={setIsValid} phase={p} updatePhase={updatePhase} index={index}/>}
								</>
							))}
						</>

					)}
					<div className="mt-8">
						<button
							className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
							onClick={() => setStep(step - 1)}
						>
							Précédent
						</button>
						<button
							className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							onClick={handleNextStep}
						>
							Suivant
						</button>
					</div>
				</div>
				<div className="w-1/3 p-4">
					<RecapTournament tournament={tournament} />
				</div>
			</div>
		</div>
	)
}