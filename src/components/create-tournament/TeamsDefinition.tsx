import React, { useState} from "react";
import {Tournament} from "../../models/Tournament";
import {Button} from "../generic/Button";

interface Props {
	setTournament: (value: Tournament) => void;
	tournament: Tournament;
	setIsValid: (value: boolean) => void;
}
export const TeamsDefinition: React.FC<Props> = ({setTournament, tournament, setIsValid}) => {
	const [inputValue, setInputValue] = useState('');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	const handleSubmit = () => {
		const updatedTeams = [...tournament.teams, inputValue];
		const updatedTournament = {...tournament, teams: updatedTeams, numberTeams: updatedTeams.length};
		setTournament(updatedTournament);
		setInputValue('');

		// Appeler checkValidity après avoir mis à jour le state tournament
		checkValidity(updatedTeams);
	};

	const checkValidity = (teams: string[]) => {
		if (teams.length > 0) setIsValid(true);
		else setIsValid(false);
	};

	const handleDelete = (indexToDelete: number) => {
		setTournament({...tournament,
			teams: tournament.teams.filter((_, index) => index !== indexToDelete),
		});
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' ) handleSubmit();
	}

	return (
		<>
			<h1 className="text-3xl font-bold mt-5 mb-4">Les équipes</h1>
			<div className="mt-5 flex flex-col md:flex-row items-center">
				<input
					type="text"
					className="bg-white rounded-lg border-gray-400 border-2 py-2 px-4 leading-tight focus:outline-none focus:border-blue-500 mb-2 md:mb-0 md:mr-4"
					placeholder="Nom de l'équipe"
					id="teamName"
					value={inputValue}
					onChange={handleChange}
					onKeyUp={(e) => handleKeyPress(e)}
				/>
				<Button color="primary" action={handleSubmit}>Valider</Button>
			</div>

			<div className="w-1/2 my-8 mx-4 rounded-lg shadow-md">
				<ul className="divide-y divide-gray-300 p-4">
					{tournament.teams.map((e, index) => (
						<li key={index} className="flex items-center justify-between py-2">
							<span className="text-gray-700">{e}</span>
							<Button action={() => handleDelete(index)} color="danger" additionalClass=''>X</Button>
						</li>
					))}
				</ul>
			</div>

		</>
	)
}