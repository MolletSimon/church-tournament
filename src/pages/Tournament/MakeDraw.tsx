import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {Tournament} from "../../models/Tournament";

interface MakeDrawProps {
	tournament: Tournament;
}

const MakeDraw: React.FC<MakeDrawProps> = ({ tournament }) => {
	const [poules, setPoules] = useState<string[][]>(
		new Array(tournament.phases[0].nombreEquipesParPoule).fill([]),
	);
	const [remainingTeams, setRemainingTeams] = useState<string[]>(tournament.teams);

	const handleDragEnd = (result: any) => {
		const { source, destination } = result;

		// Vérifiez si la tuile a été déposée dans une case valide.
		if (!destination) {
			return;
		}

		// Récupérez l'équipe en question.
		const team = remainingTeams[source.index];

		// Ajoutez l'équipe à la poule correspondante.
		const newPoules = [...poules];
		newPoules[Number(destination.droppableId)] = [...newPoules[Number(destination.droppableId)], team];
		setPoules(newPoules);

		// Mettez à jour la liste des équipes restantes.
		const newRemainingTeams = remainingTeams.filter((teamName) => teamName !== team);
		setRemainingTeams(newRemainingTeams);
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className="h-full flex flex-col justify-center items-center">
				<h1 className="text-4xl font-bold mt-12">Saisie des poules</h1>
				<h3 className="text-lg italic mb-12 mt-4 text-blue-500">Glisser déposer les équipes dans les poules correspondantes</h3>
				<div className="flex flex-col justify-center items-center md:flex-row w-full max-w-6xl">
					<div className="md:mr-12 mb-8 md:mb-0">
						<h2 className="text-2xl font-bold mb-4">Équipes :</h2>
						<Droppable droppableId="teams">
							{(provided) => (
								<div {...provided.droppableProps} ref={provided.innerRef} className="bg-white rounded-md p-6 shadow-md">
									{remainingTeams.map((team, index) => (
										<Draggable key={team} draggableId={team} index={index}>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className="bg-gray-100 p-4 rounded-md mb-2"
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
							{poules.map((pouleTeams, pouleIndex) => (
								<Droppable key={pouleIndex} droppableId={pouleIndex.toString()}>
									{(provided) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className="bg-white rounded-md p-6 shadow-md"
										>
											<h3 className="text-xl font-bold mb-4">Poule {pouleIndex + 1}</h3>
											{pouleTeams.map((team, teamIndex) => (
												<div key={teamIndex} className="bg-blue-500 text-white rounded-md p-2 mb-2">
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
				</div> </div>
		</DragDropContext>
	);
};

export default MakeDraw;