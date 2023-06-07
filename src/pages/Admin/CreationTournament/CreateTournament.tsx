import React, {useEffect, useState} from "react";
import {Tournament} from "../../../models/Tournament";
import {TournamentDefinition} from "./TournamentDefinition";
import {TeamsDefinition} from "./TeamsDefinition";
import RecapTournament from "./RecapTournament";
import GroupPhaseDefinition from "./GroupPhaseDefinition";
import PhasesTournamentDefinition from "./PhasesTournamentDefinition";
import FinalRecap from "./FinalRecap";
import {Phase} from "../../../models/Phase";
import {Button} from "../../../components/generic/Button";
import {useNavigate} from "react-router-dom";

export const CreateTournament = () => {
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
		setStep(step-1);
	}

	useEffect(() => {
		if (!localStorage.getItem("connected")) navigate("/login")
	}, [])

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
						<Button action={handlePrecStep} color="danger" text="Précédent" hoverColor="red-600" additionalClass="ml-4 mr-4" />
						<Button action={handleNextStep} color="success" text="Suivant" hoverColor="primary" />
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