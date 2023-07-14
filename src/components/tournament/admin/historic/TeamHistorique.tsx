import { Tournament } from "../../../../models/Tournament";
import { Match } from "../../../../models/Match";
import { Button } from "../../../generic/Button";
import { getRound } from "../manager/KnockoutPhaseComponent";
import { RankingComponent } from "../../common/RankingComponent";
import { Group } from "../../../../models/Group";

interface TeamHistoriqueProps {
	tournament: Tournament;
	team: string;
	setTeamSelected: (team: string | null) => void;
}
export const TeamHistorique: React.FC<TeamHistoriqueProps> = ({ tournament, team, setTeamSelected }) => {
	const teamWon = (m: Match) => {
		if (m.winner === team) {
			return "bg-success bg-opacity-50 text-black";
		} else if (m.winner === "Aucun") {
			return "bg-warning bg-opacity-30 text-black";
		} else if (m.winner !== undefined) {
			return "bg-danger bg-opacity-30 text-black";
		} else return "";
	};

	const ConsultMatch = (m: Match, i: number) => {
		return (
			<div className={`border-2 grid grid-cols-5 px-2 py-4 rounded-3xl border-primary text-center items-center ${teamWon(m)}`} key={i}>
				<p className="font-bold">{m.teams[0]}</p>
				<p>{m.score1 !== undefined ? m.score1 : "N/A"}</p>
				<p>-</p>
				<p>{m.score2 !== undefined ? m.score2 : "N/A"}</p>
				<p className="font-bold">{m.teams[1]}</p>
			</div>
		);
	};
	return (
		<>
			<div className="flex gap-8  my-6 items-center">
				<p className="italic text-primary text-xl">Équipe : {team}</p>
				<Button color="primary" action={() => setTeamSelected(null)}>Changer d'équipe</Button>
			</div>
			{tournament.phases && tournament.phases.map((phase, index) => (
				<div key={index}>
					<h3 className="font-bold">Phase numéro : {index + 1} - {phase.name}</h3>
					<p>Type : {phase.type}</p>
					{phase.type === "Poules" ? <>
						<div className="grid grid-cols-3 gap-4 m-4">
							{phase.groups?.find(g => g.teams.includes(team))?.matches.map((m, i) => (
								<>
									{m.teams.includes(team) && <>
										{ConsultMatch(m, i)}
									</>}
								</>
							))}
						</div>
						<div className="w-2/3 m-6">
							<p className="italic font-bold">Classement sur la fin de la phase :</p>
							<RankingComponent phase={index} detailsLevel={2} selectedGroup={phase.groups?.find(g => g.teams.includes(team)) || {} as Group} tournament={tournament} />
						</div>
					</> : <div className="grid grid-cols-3 gap-4 m-4">
						{phase.knockout?.matches?.filter(m => m.teams.includes(team)).map((m, i) => (
							<>
								<div>
									<p className="ml-2 mb-2 italic font-bold underline">Round : {getRound(m.round)}</p>
									{ConsultMatch(m, i)}
								</div>
							</>
						))}
					</div>}
				</div>
			))}
		</>
	);
};
