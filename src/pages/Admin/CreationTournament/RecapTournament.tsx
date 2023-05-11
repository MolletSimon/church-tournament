import {Tournament} from "../../../models/Tournament";

type Props = {
	tournament: Tournament;
};

const RecapTournament = ({ tournament }: Props) => {
	return (
		<div className="bg-white shadow-xl rounded-lg p-6">
			<h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
			<div className="mb-4">
				<span className="font-bold text-gray-700">Nom du tournoi : </span>
				<span className="text-gray-600">{tournament.name || 'Non renseigné'}</span>
			</div>
			<div className="mb-4">
				<span className="font-bold text-gray-700">Nombre d'équipes : </span>
				<span className="text-gray-600">{tournament.numberTeams || 0}</span>
			</div>
			<div className="mb-4">
				<span className="font-bold text-gray-700">Date du tournoi : </span>
				<span className="text-gray-600">{tournament.dateTournament ? tournament.dateTournament.toLocaleDateString() : 'Non renseigné'}</span>
			</div>
			<div className="mb-4">
				<span className="font-bold text-gray-700">Noms des équipes :</span>
				{tournament.teams.length > 0 ? (
					<ul className="list-disc list-inside text-gray-600">
						{tournament.teams.map((team, index) => (
							<li key={index}>{team}</li>
						))}
					</ul>
				) : (
					<span className="text-gray-600"> Non renseigné</span>
				)}
			</div>
			<div className="mb-4">
				<span className="font-bold text-gray-700">Phases du tournoi :</span>
				{tournament.phases.length > 0 ? (
					<ul className="list-disc list-inside text-gray-600">
						{tournament.phases.map((phase, index) => (
							<li key={index}>{phase.name ? `${phase.name} (${phase.type})` : phase.type}</li>
						))}
					</ul>
				) : (
					<span className="text-gray-600"> Non renseigné</span>
				)}
			</div>
		</div>
	);
};

export default RecapTournament;