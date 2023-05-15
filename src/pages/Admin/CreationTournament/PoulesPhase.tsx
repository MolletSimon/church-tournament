import {ChangeEvent, useEffect, useState} from 'react';
import {Phase} from "../../../models/Tournament";

interface PoulesPhaseProps {
	phase: Phase,
	updatePhase: (phase: Phase, index: number) => void,
	index: number;
	setIsValid: (value: boolean) => void;
}

const PoulesPhase: React.FC<PoulesPhaseProps> = ({ phase, updatePhase, index, setIsValid }) => {
	const [isAllerRetour, setIsAllerRetour] = useState(phase.isAllerRetour || false);
	const [nombreEquipesParPoule, setNombreEquipesParPoule] = useState(phase.nombreEquipesParPoule || 4);
	const [nombreQualifiesParPoule, setNombreQualifiesParPoule] = useState(phase.nombreQualifiesParPoule || 2);

	const handleIsAllerRetourChange = (event: ChangeEvent<HTMLInputElement>) => {
		setIsAllerRetour(event.target.checked);
		updatePhase({
			...phase,
			isAllerRetour: event.target.checked,
		}, index);
	};

	useEffect(() => {
		setIsValid(true)
	}, [setIsValid])

	const handleNombreEquipesParPouleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setNombreEquipesParPoule(parseInt(event.target.value));
		updatePhase({
			...phase,
			nombreEquipesParPoule: parseInt(event.target.value),
		}, index);
	};

	const handleNombreQualifiesParPouleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setNombreQualifiesParPoule(parseInt(event.target.value));
		updatePhase({
			...phase,
			nombreQualifiesParPoule: parseInt(event.target.value),
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
						checked={isAllerRetour}
						onChange={handleIsAllerRetourChange}
					/>
					<span className="text-sm">Matchs aller/retour</span>
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
						value={nombreEquipesParPoule}
						onChange={handleNombreEquipesParPouleChange}
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
						max={nombreEquipesParPoule - 1}
						value={nombreQualifiesParPoule}
						onChange={handleNombreQualifiesParPouleChange}
					/>
				</label>
			</div>
		</div>
	);
};

export default PoulesPhase;