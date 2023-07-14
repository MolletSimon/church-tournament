import {Link, useParams} from "react-router-dom";
import {Tournament} from "../../models/Tournament";
import {useEffect, useState} from "react";
import {Button} from "../../components/generic/Button";
import { TeamHistorique } from "../../components/tournament/admin/historic/TeamHistorique";
import { TeamList } from "../../components/tournament/admin/historic/TeamList";
import { TournamentService } from "../../services/TournamentService";

export const HistoricPage = () => {
	const {id} = useParams();
	const [tournament, setTournament] = useState({} as Tournament);
	const [teamSelected, setTeamSelected] = useState<string | null>(null);
	const tournamentService = new TournamentService();

	useEffect(() => {
		if(id) {
			tournamentService.FetchTournament(id).then((data) => {
				setTournament(data);
			});
		} 
	}, [id]);

	const handleClickOnTeam = (team: string) => {
		setTeamSelected(team);
	}

	return (
		<div className="m-10 bg-neutral-50">
			<div className="flex items-center gap-8">
				<h1 className="text-3xl text-primary font-bold">Historique des équipes</h1>
				<Link to={`/tournament/${id}`}>
					<Button  color="danger">Retour au menu tournoi</Button>
				</Link>
			</div>
			{tournament && tournament.teams && (
				<>
					{
						teamSelected ? 
							<TeamHistorique setTeamSelected={setTeamSelected} tournament={tournament} team={teamSelected} /> : 
							<TeamList handleClick={handleClickOnTeam} tournament={tournament} />
					}
				</>
			)}
		</div>
	)
}

