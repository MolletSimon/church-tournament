import React, {ChangeEvent, useEffect, useState} from 'react';

import {Phase} from "../../../models/Phase";

interface PoulesPhaseProps {
	phase: Phase,
	updatePhase: (phase: Phase, index: number) => void,
	index: number;
	setIsValid: (value: boolean) => void;
}

const GroupPhaseDefinition: React.FC<PoulesPhaseProps> = ({ phase, updatePhase, index, setIsValid }) => {
	const [isHomeAndAway, setIsHomeAndAway] = useState(phase.isHomeAndAway || false);
	const [numberGroups, setNumberGroups] = useState(phase.numberGroups || 4);
	const [numberTeamsByGroup, setNumberTeamsByGroup] = useState(phase.numberTeamsByGroup || 4);
	const [numberQualifiedByGroup, setNumberQualifiedByGroup] = useState(phase.numberQualifiedByGroup || 2);

	const handleIsHomeAndAwayChange = (event: ChangeEvent<HTMLInputElement>) => {
		setIsHomeAndAway(event.target.checked);
		updatePhase({
			...phase,
			isHomeAndAway: event.target.checked,
		}, index);
	};

	useEffect(() => {setIsValid(true)}, [])

	const handleNumberTeamsByGroupChange = (event: ChangeEvent<HTMLInputElement>) => {
		setNumberTeamsByGroup(parseInt(event.target.value));
		updatePhase({
			...phase,
			numberTeamsByGroup: parseInt(event.target.value),
		}, index);
	};

	const handleNumberGroupsChange = (event: ChangeEvent<HTMLInputElement>) => {
		setNumberGroups(parseInt(event.target.value));
		updatePhase({
			...phase,
			numberGroups: parseInt(event.target.value),
		}, index);
	};

	const handleNumberQualifiedByGroupChange = (event: ChangeEvent<HTMLInputElement>) => {
		setNumberQualifiedByGroup(parseInt(event.target.value));
		updatePhase({
			...phase,
			numberQualifiedByGroup: parseInt(event.target.value),
		}, index);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-4 mb-4 border-2 border-blue-500">
			<h2 className="text-xl font-bold mb-4 italic">{phase.name}</h2>
			<div className="mb-4">
				<label className="block mb-2">
					<input
						type="checkbox"
						className="mr-2 leading-tight"
						checked={isHomeAndAway}
						onChange={handleIsHomeAndAwayChange}
					/>
					<span className="text-sm">Matchs aller/retour</span>
				</label>
			</div>
			<div className="mb-4">
				<label className="block mb-2">
					Nombre de poules :
					<input
						type="number"
						className="ml-2 border border-gray-400 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						min="2"
						max="20"
						value={numberGroups}
						onChange={handleNumberGroupsChange}
					/>
				</label>
			</div>
			<div className="mb-4">
				<label className="block mb-2">
					Nombre d'équipes par poule :
					<input
						type="number"
						className="ml-2 border border-gray-400 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						min="2"
						max="20"
						value={numberTeamsByGroup}
						onChange={handleNumberTeamsByGroupChange}
					/>
				</label>
			</div>
			<div className="mb-4">
				<label className="block mb-2">
					Nombre d'équipes qualifiées par poule :
					<input
						type="number"
						className="ml-2 border border-gray-400 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						min="1"
						value={numberQualifiedByGroup}
						onChange={handleNumberQualifiedByGroupChange}
					/>
				</label>
			</div>
		</div>
	);
};

export default GroupPhaseDefinition;