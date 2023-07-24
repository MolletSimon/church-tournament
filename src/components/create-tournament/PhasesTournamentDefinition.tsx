import React, {useEffect, useState} from "react";
import { Tournament } from "../../models/Tournament";
import {Phase} from "../../models/Phase";
import {Button} from "../generic/Button";
import { FormInput } from "../generic/FormInput";
import { FormSelect } from "../generic/FormSelect";

type Props = {
	tournament: Tournament;
	setTournament: (tournament: Tournament) => void;
	setIsValid: (value: boolean) => void;
};

const PhasesTournamentDefinition: React.FC<Props> = ({ tournament, setTournament, setIsValid }) => {
	const [numberPhase, setNumberPhase] = useState(tournament.numberPhase);
	const [phases, setPhases] = useState<Phase[]>(tournament.phases);

	const handleNumberPhaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(event.target.value);
		if (isNaN(value) || value < 1 || value > 10) {
			setNumberPhase(0);
			setPhases([]);
		} else {
			setNumberPhase(value);
			setPhases(Array(value).fill({ type: 'Poules' }));
		}
	};

	const handlePhaseNameChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const value = event.target.value;
		setPhases(phases.map((phase, i) => i === index ? { ...phase, name: value } : phase));
	};

	const handlePhaseTypeChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
		const value = event.target.value as 'Poules' | 'Elimination directe';
		setPhases(phases.map((phase, i) => i === index ? { ...phase, type: value } : phase));
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		phases.forEach((phase, index) => {
			phase.id = index
			if (phase.type === 'Poules') {
				phase.numberGroups = 4;
				phase.isHomeAndAway = false;
				phase.numberTeamsByGroup = 4;
				phase.numberQualifiedByGroup = 2;
				phase.active = false;
			}
		})
		setTournament({ ...tournament, phases, numberPhase });
	};

	useEffect(() => {
		if(tournament.numberPhase) {
			setIsValid(true);
			tournament.phases.forEach(phase => {
				if (!phase.type || !phase.name) setIsValid(false);
			})
		}
	}, [setIsValid, tournament])

	return (
		<form onSubmit={handleSubmit}>
			<FormInput 
				id="numberPhase" 
				label="Nombre de phases"
				placeholder="Entrez le nombre de phases de la compétition"
				type="number"
				value={numberPhase}
				additionalClass="mb-6"
				onChange={handleNumberPhaseChange}
				min="1"
				max="10"
				required={true}
				></FormInput> 
				{/* <label className="block text-gray-700 font-bold mb-2" htmlFor="numberPhase">
					Nombre de phases
				</label>
				<input
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					id="numberPhase"
					type="number"
					value={numberPhase}
					onChange={handleNumberPhaseChange}
					min="1"
					max="10"
					required
				/> */}
			{phases.map((phase, index) => (
				<div key={index} className="border border-gray-200 rounded-xl p-8 mb-4">
					<FormInput 
						label={`Nom de la phase #${index + 1}`}
						placeholder="Entrez le nom de la phase"
						type="text"
						value={phase.name || ''}
						additionalClass="mb-6 w-full"
						id={`phaseName${index}`}
						onChange={(event) => handlePhaseNameChange(event, index)}
						></FormInput>
					<FormSelect 
						label={`Type de la phase #${index + 1}`}
						value={phase.type}
						additionalClass="mb-2 w-full"
						name={`phaseType${index}`}
						options={[
							{value: 'Poules', label: 'Poules'},
							{value: 'Elimination directe', label: 'Elimination directe'}
						]}
						onChange={(event) => handlePhaseTypeChange(event, index)}
					></FormSelect>
				</div>
			))}
			<Button color='primary' type='submit'>Enregistrer</Button>
		</form>
	);
};

export default PhasesTournamentDefinition;