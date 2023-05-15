import {Tournament} from "../../../models/Tournament";
import React, {useEffect} from "react";

interface Props {
	tournament: Tournament;
	setTournament: (value: Tournament) => void;
	setIsValid: (value: boolean) => void;
}

export const TournamentDefinition: React.FC<Props> = ({tournament, setTournament, setIsValid}) => {
	useEffect(() => {
		if (tournament.name && tournament.numberTeams && tournament.dateTournament) setIsValid(true)
	}, [setIsValid, tournament]);

	return (
		<>
			<form className="m-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				<div className="col-span-full sm:col-span-2 md:col-span-3">
					<div className="mb-4">
						<label className="block text-gray-700 font-bold mb-2" htmlFor="name">
							Nom du tournoi
						</label>
						<input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							   id="name" type="text" placeholder="Nom" name="name" value={tournament.name}
							   onChange={(e) => setTournament({...tournament ,name: e.target.value})} />
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 font-bold mb-2" htmlFor="number-teams">
							Nombre d'équipes
						</label>
						<input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							   id="number-teams" type="number" placeholder="Nombre" name="number-teams" value={tournament.numberTeams}
							   onChange={(e) => setTournament({...tournament, numberTeams: parseInt(e.target.value)})} />
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 font-bold mb-2" htmlFor="date">
							Date du tournoi
						</label>
						<input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							   id="date" type="date" placeholder="Nom" name="name"
							   onChange={(e) => setTournament({...tournament, dateTournament: new Date(e.target.value)})} />
					</div>
				</div>
			</form>
		</>
	)
}