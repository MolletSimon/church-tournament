import {FormEvent, useState} from "react";

type Tournament = {
	name?: string,
	numberTeams?: number,
	dateTournament?: Date,
	teams: string[]
}

export const CreateTournament = () => {
	const [tournament, setTournament] = useState({teams: []} as Tournament);
	const [step, setStep] = useState(1);

	const [inputValue, setInputValue] = useState('');

		const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(event.target.value);
		};

		const handleSubmit = () => {
			setTournament((prevState) => ({
				...prevState,
				teams: [...prevState.teams, inputValue],
			}));
			setInputValue('');
		};

	const handleDelete = (indexToDelete: number) => {
		setTournament((prevState) => ({
			...prevState,
			teams: prevState.teams.filter((_, index) => index !== indexToDelete),
		}));
	};

	return (
		<div className="m-5 p-5">
			<h1 className="title">Création d'un tournoi ⚽️</h1>
			{step === 1 && <>
				<form className="m-5 columns">
					<div className="column mt-5 is-three-fifths is-offset-one-fifth">
						<div className="field">
							<label className="label">Nom du tournoi</label>
							<div className="control">
								<input className="input" type="text" placeholder="Nom" name="name"
									   onChange={(e) => setTournament(prevState => ({...prevState, name: e.target.value}))} />
							</div>
						</div>
						<div className="field">
							<label className="label">Nombre d'équipes</label>
							<div className="control">
								<input className="input" type="number" placeholder="Nombre" name="number-teams"
									   onChange={(e) => setTournament(prevState => ({...prevState, numberTeams: parseInt(e.target.value)}))}/>
							</div>
						</div>
						<div className="field">
							<label className="label">Date du tournoi</label>
							<div className="control">
								<input className="input" type="date" placeholder="Nom" name="name"
									   onChange={(e) => setTournament(prevState => ({...prevState, dateTournament: new Date(e.target.value)}))}/>
							</div>
						</div>
						<button className="button is-primary is-light" onClick={() => setStep(2)}>Suivant (composition des équipes)</button>
					</div>

				</form>
			</>}

			{step === 2 && <>
				<h1 className="title">Les équipes️</h1>
				<div className="container columns is-half">
					<input
						type="text"
						className="input is-success is-rounded"
						placeholder="Nom de l'équipe"
						value={inputValue}
						onChange={handleChange}
					/>
					<button onClick={handleSubmit}>Valider</button>
				</div>
			</> }

			<div className="columns is-centered is-half">
				<div className="card ">
					<div className="card-header">
						<p className="card-header-title">
							Récapitulatif
						</p>
					</div>
					<div className="card-content">
						<div className="content">
							<h1>{tournament.name}</h1>
							<p>{tournament.numberTeams ? tournament.numberTeams + " équipes" : ""}</p>
							<p>{tournament.dateTournament?.getDay()}</p>
							<p>Les équipes : </p>
							<ul>
								{tournament.teams.map((e, index) => (
									<li key={index}>{e} <button onClick={() => handleDelete(index)}>Supprimer</button></li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}