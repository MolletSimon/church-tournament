import React, { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import {doc, getDoc, onSnapshot} from "firebase/firestore";
import {Match} from "../../../models/Match";
import {Tournament} from "../../../models/Tournament";
import {db} from "../../../index";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaFutbol, FaMapMarkerAlt } from "react-icons/fa";
import {Button} from "../../../components/generic/Button";
import {Phase} from "../../../models/Phase";
import {Group} from "../../../models/Group";
import {GroupMobileComponent} from "../../../components/mobile/GroupMobileComponent";
import {PhaseType} from "../../../models/Enums/PhaseType";
import {MatchMobileComponent} from "../../../components/mobile/MatchMobileComponent";
import {getRound} from "../Admin/KnockoutPhase";

export type TeamMatch = {
	match: Match;
	isUpcoming: boolean;
};

const TeamPage = () => {
	const { tournamentId, teamName } = useParams<{ tournamentId: string; teamName: string }>();
	const [tournament, setTournament] = useState<Tournament>();
	const [teamMatches, setTeamMatches] = useState<Match[]>([]);
	const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);
	const [currentGroup, setCurrentGroup] = useState<Group | null>(null);

	useEffect(() => {
		const fetchTournament = async () => {
			if (tournamentId != null) {
				const docRef = doc(db, "tournaments", tournamentId);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const tournament = docSnap.data() as Tournament;
					setTournament(tournament);
					setCurrentPhase(tournament.phases[tournament.currentPhase]);
					if (tournament.phases[tournament.currentPhase]?.type === "Poules") setCurrentGroup(tournament.phases[tournament.currentPhase].groups!.find(g => g.teams!.includes(teamName!)) ?? null)
				} else {
					console.log("No such document!");
				}
			}
		};

		const subscriber = onSnapshot(doc(db, "tournaments", tournamentId!), (doc) => {
			const tournament = doc.data() as Tournament;
			setTournament(tournament);
			setCurrentPhase(tournament.phases[tournament.currentPhase]);
			if (tournament.phases[tournament.currentPhase]?.type === "Poules") setCurrentGroup(tournament.phases[tournament.currentPhase].groups!.find(g => g.teams!.includes(teamName!)) ?? null)
		})

		fetchTournament();

		return () => subscriber()

	}, [tournamentId]);

	useEffect(() => {
		if (tournament) {
			let matches = [] as Match[];

			if (currentPhase) {
				if (currentPhase.type === PhaseType.GROUP) {
					matches = currentPhase.groups?.flatMap(group => group.matches || []) || [];
				} else {
					matches = currentPhase.knockout?.matches || [];
				}
			}

			const teamMatches = matches?.filter(match => match.teams.includes(teamName!)) || [];
			setTeamMatches(teamMatches);
		}
	}, [tournament, teamName]);

	return (
		<div className="min-h-screen bg-[#F9F9FB]">
			{currentPhase  && <>
				<div className=" py-6 mb-4 flex px-10 justify-center gap-4 items-center">
					<img src="/images/football-team.png" width={30}/>
					<h1 className="text-primary text-center font-bold text-3xl">{teamName}</h1>
				</div>
				<div className="px-4">
					{currentPhase.type === "Poules" ?
						<GroupMobileComponent currentGroup={currentGroup!} teamMatches={teamMatches} tournament={tournament!} tournamentId={tournamentId!} /> :
						<>
							<h3 className="text-2xl underline">Phases finales</h3>
							{getRound(currentPhase.knockout!.roundOf!)}
							{teamMatches.map(m => (
								<div className="m-4 p-4 border-2 rounded-xl border-primary">
									<MatchMobileComponent teamWon={() => ""} m={m} />
								</div>
							))}
						</>
					}
				</div>
			</>}

		</div>
	);
};

export default TeamPage;