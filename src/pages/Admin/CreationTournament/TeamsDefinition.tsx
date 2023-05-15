import React, { useEffect, useState} from "react";
import {Tournament} from "../../../models/Tournament";

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
		setTournament({...tournament, teams: [...tournament.teams, inputValue]});
		setInputValue('');
	};

	useEffect(() => {
		if (tournament.teams.length > 0) setIsValid(true)
		else setIsValid(false)
	}, [setIsValid, tournament])

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
					value={inputValue}
					onChange={handleChange}
					onKeyUp={(e) => handleKeyPress(e)}
				/>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					onClick={handleSubmit}
				>
					Valider
				</button>
			</div>

			<div className="w-1/2 my-8 mx-4 rounded-lg shadow-md">
				<ul className="divide-y divide-gray-300 p-4">
					{tournament.teams.map((e, index) => (
						<li key={index} className="flex items-center justify-between py-2">
							<span className="text-gray-700">{e}</span>
							<button onClick={() => handleDelete(index)} className="rounded-full bg-red-500 hover:bg-red-700 text-white p-2 focus:outline-none focus:shadow-outline">
								<svg className="h-4 w-4 fill-current text-white" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M12.071,10.002 L19.142,16.68 C19.533,17.072 19.533,17.704 19.142,18.095 C18.951,18.286 18.704,18.382 18.457,18.382 C18.209,18.382 17.963,18.286 17.771,18.095 L10.695,11.417 L3.619,18.095 C3.427,18.286 3.181,18.382 2.933,18.382 C2.686,18.382 2.439,18.286 2.247,18.095 C1.856,17.704 1.856,17.072 2.247,16.68 L9.318,10.002 L2.242,3.324 C1.851,2.932 1.851,2.3 2.242,1.909 C2.633,1.517 3.266,1.517 3.658,1.909 L10.734,8.587 L17.81,1.909 C18.201,1.517 18.834,1.517 19.225,1.909 C19.616,2.3 19.616,2.932 19.225,3.324 L12.149,10.002 L12.071,10.002 Z"
									/>
								</svg>
							</button>
						</li>
					))}
				</ul>
			</div>

		</>
	)
}