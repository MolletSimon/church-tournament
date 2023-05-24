import React, {useEffect, useState} from "react";
import { Tournament } from "../../../models/Tournament";
import {Phase} from "../../../models/Phase";
import {Button} from "../../../components/generic/Button";

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
			console.log(tournament)
			setIsValid(true);
			tournament.phases.forEach(phase => {
				if (!phase.type || !phase.name) setIsValid(false);
			})
		}
	}, [setIsValid, tournament])

	return (
		<form onSubmit={handleSubmit}>
			<div className="mb-4">
				<label className="block text-gray-700 font-bold mb-2" htmlFor="numberPhase">
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
				/>
			</div>
			{phases.map((phase, index) => (
				<div key={index} className="border border-gray-400 rounded-md p-4 mb-4">
					<div className="mb-4">
						<label className="block text-gray-700 font-bold mb-2" htmlFor={`phaseName${index}`}>
							Nom de la phase #{index + 1}
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id={`phaseName${index}`}
							type="text"
							value={phase.name || ''}
							onChange={(event) => handlePhaseNameChange(event, index)}
							maxLength={30}
						/>
					</div>
					<div>
						<label className="block text-gray-700 font-bold mb-2" htmlFor={`phaseType${index}`}>
							Type de la phase #{index + 1}
						</label>
						<select
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id={`phaseType${index}`}
							value={phase.type}
							onChange={(event) => handlePhaseTypeChange(event, index)}
						>
							<option value="Poules">Poules</option>
							<option value="Elimination directe">Elimination directe</option>
						</select>
					</div>
				</div>
			))}
			<Button text='Enregistrer' color='primary' type='submit' />
		</form>
	);
};

export default PhasesTournamentDefinition;