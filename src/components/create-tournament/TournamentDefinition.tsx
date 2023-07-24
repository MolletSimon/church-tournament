import {Tournament} from "../../models/Tournament";
import React, {useEffect, useRef, useState} from "react";
import { FormInput } from "../generic/FormInput";

interface Props {
	tournament: Tournament;
	setTournament: (value: Tournament) => void;
	setIsValid: (value: boolean) => void;
}

export const TournamentDefinition: React.FC<Props> = ({tournament, setTournament, setIsValid}) => {
	const name = useRef<HTMLInputElement>(null);
	const date = useRef<HTMLInputElement>(null);
	const [errors, setErrors] = useState({
		name: "",
		date: ""
	})

	useEffect(() => {
		if (!errors.name && !errors.date && name.current?.value && date.current?.value) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}, [errors, setIsValid]);

	const handleBlur = () => {
		checkErrors();
		setTournament({...tournament, name: name.current?.value, dateTournament: date.current ? new Date(date.current.value) : undefined});
	}

	const checkErrors = () => {
		if (!name.current?.value) {
			setErrors(prevErrors => {
				return {...prevErrors, name: "Le nom du tournoi est obligatoire"}
			});
		} else {
			setErrors(prevErrors => {
				return {...prevErrors, name: ""}
			});
		}

		if (!date.current?.value) {
			setErrors(prevErrors =>{
				return {...prevErrors, date: "La date du tournoi est obligatoire"}
			}); 
		} else {
			setErrors(prevErrors => {
				return {...prevErrors, date: ""}
			});
		}
	}

	return (
		<>
			<form className="m-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				<div className="col-span-full sm:col-span-2 md:col-span-3">
					<FormInput 
						id="tournament-name" 
						label="Nom du tournoi" 
						additionalClass="mt-6 mb-8"
						onBlur={handleBlur}
						type="text" 
						error={errors.name}
						defaultValue={tournament.name}
						align="left"
						placeholder="Renseignez le nom du tournoi" 
						innerRef={name}></FormInput>

					<FormInput 
						id="tournament-date" 
						label="Date du tournoi" 
						additionalClass="mt-6 mb-8"
						defaultValue={tournament.dateTournament?.toISOString().substring(0,10)}
						error={errors.date}
						onBlur={handleBlur}
						type="date" 
						align="left"
						placeholder="JJ/MM/AAAA" 
						innerRef={date}></FormInput>
				</div>
			</form>
		</>
	)
}