import React, { useState} from "react";
import {Tournament} from "../../../models/Tournament";
import {TournamentDefinition} from "./TournamentDefinition";
import {TeamsDefinition} from "./TeamsDefinition";
import PhaseDefinition from "./PhaseDefinition";
import RecapTournament from "./RecapTournament";

export const CreateTournament = () => {
	const [tournament, setTournament] = useState({teams: [], phases: []} as Tournament);
	const [step, setStep] = useState(1);

	return (
		<div className="m-5 p-5">
			<div className="flex flex-row">
				<div className="w-2/3 p-4 pr-8">
					<h1 className="text-xl font-bold mb-4">Création d'un tournoi ⚽️</h1>
					{step === 1 && (
						<TournamentDefinition tournament={tournament} setTournament={setTournament} />
					)}
					{step === 2 && (
						<TeamsDefinition setTournament={setTournament} tournament={tournament} />
					)}
					{step === 3 && (
						<PhaseDefinition tournament={tournament} setTournament={setTournament} />
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
							onClick={() => setStep(step + 1)}
						>
							Suivant (composition des équipes)
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