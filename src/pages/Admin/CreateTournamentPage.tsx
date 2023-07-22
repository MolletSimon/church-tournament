import React, {useEffect, useState} from "react";
import {Tournament} from "../../models/Tournament";
import {TournamentDefinition} from "../../components/create-tournament/TournamentDefinition";
import {TeamsDefinition} from "../../components/create-tournament/TeamsDefinition";
import RecapTournament from "../../components/create-tournament/RecapTournament";
import GroupPhaseDefinition from "../../components/create-tournament/GroupPhaseDefinition";
import PhasesTournamentDefinition from "../../components/create-tournament/PhasesTournamentDefinition";
import FinalRecap from "../../components/create-tournament/FinalRecap";
import {Phase} from "../../models/Phase";
import {Button} from "../../components/generic/Button";
import {useNavigate} from "react-router-dom";

export const CreateTournamentPage = () => {
	const [tournament, setTournament] = useState({teams: [], phases: [], status: "init", currentPhase:0} as Tournament);
	const [step, setStep] = useState(1);
	const [isValid, setIsValid] = useState(false);
	const navigate = useNavigate();

	const updatePhase = (phase: Phase, index: number) => {
		tournament.phases[index] = phase;
		setTournament({...tournament});
	};

	const handleNextStep = () => {
		if (isValid) {
			setStep(step+1);
			setIsValid(false);
		}
	};

	const handlePrecStep = () => {
		if (step > 1) setStep(prevStep => prevStep - 1);
		if (step === 1) navigate("../home");
	}

	return (
		<div className="m-5 p-5">
			<div className="flex flex-row">
				<div className="w-2/3 p-4 pr-8">
					<h1 className="text-3xl text-primary font-bold mb-4">Création d'un tournoi ⚽️</h1>
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
									{p.type === "Poules" && <GroupPhaseDefinition setIsValid={setIsValid} phase={p} updatePhase={updatePhase} index={index}/>}
								</>
							))}
						</>

					)}
					{step === 5 && (
						<FinalRecap tournament={tournament} />
					)}

					{step < 5 && <div className="mt-8">
						<Button action={handlePrecStep} color="danger"  hoverColor="red-600" additionalClass="ml-4 mr-4">Précédent</Button>
						<Button action={handleNextStep} color="success"  hoverColor="primary">Suivant</Button>
					</div>}
				</div>
				{step < 5 && <>
					<div className="w-1/3 p-4">
						<RecapTournament tournament={tournament} />
					</div>
				</>}

			</div>
		</div>
	);
};