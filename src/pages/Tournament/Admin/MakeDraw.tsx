import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {Tournament} from "../../../models/Tournament";
import {Button} from "../../../components/generic/Button";
import { doc, setDoc } from "firebase/firestore";
import {db} from "../../../index";
import {TournamentService} from "../../../services/TournamentService";

interface MakeDrawProps {
	tournament: Tournament;
	setTournament: (value: Tournament) => void;
	setDrawMode: (value: boolean) => void;
}

const MakeDraw: React.FC<MakeDrawProps> = ({ tournament, setTournament, setDrawMode }) => {
	const [groups, setGroups] = useState<string[][]>(
		new Array(tournament.phases[0].numberGroups).fill([]),
	);
	const [remainingTeams, setRemainingTeams] = useState<string[]>(tournament.teams);

	const handleDragEnd = (result: any) => {
		const { source, destination } = result;

		if (!destination || destination.droppableId === "teams") {
			return;
		}

		const team = remainingTeams[source.index];

		const newGroups = [...groups];
		newGroups[Number(destination.droppableId)] = [...newGroups[Number(destination.droppableId)], team];
		setGroups(newGroups);

		const newRemainingTeams = remainingTeams.filter((teamName) => teamName !== team);
		setRemainingTeams(newRemainingTeams);
	};

	const handleReset = () => {
		setRemainingTeams(tournament.teams);
		setGroups((
			new Array(tournament.phases[0].numberGroups).fill([])
		));
	};

	const handleValidate = async () => {
		const document = doc(db, "tournaments", tournament.id!);
		const tournamentService = new TournamentService();
		console.log(groups)
		const updatedPhases = tournamentService.GeneratePhase(tournament, groups);
		const newTournament: Tournament = {...tournament, phases: updatedPhases, status: "drawMade", currentPhase: 0}
		await setDoc(document, newTournament);
		setTournament(newTournament);
		setDrawMode(false);
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className="h-full flex flex-col justify-center items-center">
				<h1 className="text-4xl font-bold mt-12">Saisie des poules</h1>
				<h3 className="text-lg italic mb-12 mt-4 text-primary">Glisser et déposer les équipes dans les poules correspondantes</h3>
				<div className="flex flex-col justify-center items-center md:flex-row w-full">
					<div className="md:mr-12 mb-8 md:mb-0 w-1/2">
						<h2 className="text-2xl font-bold mb-4">Équipes :</h2>
						<Droppable droppableId="teams">
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="bg-white rounded-md p-2 shadow-md flex flex-wrap justify-center"
								>
									{remainingTeams.map((team, index) => (
										<Draggable key={team} draggableId={team} index={index}>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className="bg-gray-100 text-center p-4 rounded-full mb-2 mx-2 w-1/5"
												>
													{team}
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
					<div>
						<h2 className="text-2xl font-bold mb-4">Poules :</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{groups.map((groupTeams, groupIndex) => (
								<Droppable key={groupIndex} droppableId={groupIndex.toString()}>
									{(provided) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className="bg-white rounded-md p-6 shadow-md"
										>
											<h3 className="text-xl font-bold mb-4">Poule {groupIndex + 1}</h3>
											{groupTeams.map((team, teamIndex) => (
												<div key={teamIndex} className="bg-primary text-center text-white rounded-full p-4 px-6 mb-2">
													{team}
												</div>
											))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							))}
						</div>
					</div>
				</div>
				<div className="flex gap-4 my-6">
					<Button text="Retour" color="primary" action={() => setDrawMode(false)} />
					<Button text="Réinitialiser" color="danger" action={handleReset} hoverColor='red-600' />
					<Button text="Valider" disabled={remainingTeams.length > 0} color="success" action={handleValidate} hoverColor='green-600' />
				</div>
			</div>

		</DragDropContext>
	);
};

export default MakeDraw;