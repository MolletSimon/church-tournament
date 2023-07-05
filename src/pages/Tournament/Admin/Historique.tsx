import {Link, useParams} from "react-router-dom";
import {doc, getDoc, Timestamp} from "firebase/firestore";
import {db} from "../../../index";
import {Tournament} from "../../../models/Tournament";
import {ChangeEvent, useEffect, useState} from "react";
import {MatchMobileComponent} from "../../../components/mobile/MatchMobileComponent";
import {Match} from "../../../models/Match";
import {Button} from "../../../components/generic/Button";
import {getRound} from "./KnockoutPhase";
import {RankingComponent} from "../../../components/tournament/RankingComponent";
import {Group} from "../../../models/Group";

export const Historique = () => {
	const {id} = useParams();
	const [launched, setLaunched] = useState(false);
	const [tournament, setTournament] = useState({} as Tournament);
	const [teamSelected, setTeamSelected] = useState<string | null>(null);

	const fetchTournament = async () => {
		const docRef = doc(db, "tournaments", id!);
		const docSnap = await getDoc(docRef);
		console.log(teamSelected)

		if (docSnap.exists()) {
			const tournamentData = docSnap.data() as Tournament;
			console.log(tournamentData)
			if (tournamentData.status === "started") setLaunched(true);
			const date = tournamentData.dateTournament as unknown as Timestamp;
			setTournament({...tournamentData, dateTournament: date.toDate()})
		} else {
			console.log("No such document!");
		}
	}

	useEffect(() => {
		if(id) fetchTournament()
	}, [id]);

	const handleClickOnTeam = (team: string) => {
		setTeamSelected(team);
	}

	return (
		<div className="m-10 bg-neutral-50">
			<div className="flex items-center gap-8">
				<h1 className="text-3xl text-primary font-bold">Historique des équipes</h1>
				<Link to={`/tournament/${id}`}>
					<Button text="Retour au menu tournoi" color="danger" />
				</Link>
			</div>
			{tournament && tournament.teams && (
				<>
					{teamSelected ? <TeamHistorique setTeamSelected={setTeamSelected} tournament={tournament} team={teamSelected} /> : <TeamList handleClick={handleClickOnTeam} tournament={tournament} />
					}
				</>
			)}
		</div>
	)
}

interface TeamHistoriqueProps {
	tournament: Tournament,
	team: string,
	setTeamSelected: (team: string | null) => void
}

const TeamHistorique: React.FC<TeamHistoriqueProps> = ({tournament, team, setTeamSelected}) => {
	const teamWon = (m: Match) => {
		if (m.winner === team) {
			return "bg-success bg-opacity-50 text-black"
		} else if (m.winner === "Aucun") {
			return "bg-warning bg-opacity-30 text-black"
		} else if (m.winner !== undefined) {
			return "bg-danger bg-opacity-30 text-black"
		} else return ""
	}

	const ConsultMatch = (m: Match, i:number) => {
		return (
			<div className={`border-2 grid grid-cols-5 px-2 py-4 rounded-3xl border-primary text-center items-center ${teamWon(m)}`} key={i}>
				<p className="font-bold">{m.teams[0]}</p>
				<p>{m.score1 !== undefined ? m.score1 : "N/A"}</p>
				<p>-</p>
				<p>{m.score2 !== undefined ? m.score2 : "N/A"}</p>
				<p className="font-bold">{m.teams[1]}</p>
			</div>
		)
	}
	return(
		<>
			<div className="flex gap-8  my-6 items-center">
				<p className="italic text-primary text-xl">Équipe : {team}</p>
				<Button text="Changer d'équipe" color="primary" action={() => setTeamSelected(null)} />
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
					</>  : <div className="grid grid-cols-3 gap-4 m-4">
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
	)
}

interface TeamListProps {
	tournament: Tournament,
	handleClick: (team: string) => void
}

const TeamList: React.FC<TeamListProps> = ({tournament, handleClick}) => {
	const [teamsDisplayed, setTeamsDisplayed] = useState(tournament.teams);

	const handleSearch = (e : ChangeEvent<HTMLInputElement>) => {
		setTeamsDisplayed(tournament.teams.filter(t => t.toUpperCase().includes(e.target.value.toUpperCase())))
	}

	return (
		<div>
			<input type="text" placeholder="Chercher une équipe..." className="p-4 italic rounded-full w-full mt-8" onChange={handleSearch}/>
			<div className="grid grid-cols-4 gap-4 mt-8">
				{teamsDisplayed && teamsDisplayed.map(team => (
					<div
						className="flex items-center justify-center p-4 rounded-full text-primary border-2 border-primary
						bg-primary bg-opacity-5 hover:bg-opacity-20 cursor-pointer hover:scale-110 transition-all"
						key={team}
						onClick={() => handleClick(team)}
					>
						<p >{team}</p>
					</div>
				))}
			</div>

		</div>
	)
}