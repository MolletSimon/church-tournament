import {Button} from "../../generic/Button";
import React from "react";
import {Group} from "../../../models/Group";
import {Tournament} from "../../../models/Tournament";

interface Props {
	selectedGroup: Group,
	tournament: Tournament,
	detailsLevel: number,
	phase: number
}

export const RankingComponent: React.FC<Props> = ({selectedGroup, tournament, detailsLevel, phase}) => {
	return (
		<>
			<div className="border-2 rounded-xl">
				<table className="table-fixed w-full divide-y divide-gray-200">
					<thead className="rounded-lg">
					<tr className="font-bold rounded-lg">
						<th className="w-1/12 px-4 py-2 text-left">N°</th>
						<th className="w-1/4 px-4 py-2">Equipe</th>
						{detailsLevel >1 && <>
							<th className="w-1/12 px-4 py-2">G</th>
							<th className="w-1/12 px-4 py-2">N</th>
							<th className="w-1/12 px-4 py-2">P</th>
						</>}
						{detailsLevel > 0 && <>
							<th className="w-1/12 px-4 py-2">BM</th>
							<th className="w-1/12 px-4 py-2">BE</th>
						</>}
						<th className="w-1/12 px-4 py-2">Diff</th>
						<th className="w-1/12 px-4 py-2">Pts</th>
					</tr>
					</thead>
					<tbody>
					{selectedGroup.ranking &&
						selectedGroup.ranking.map((team, index) => (
							<tr
								key={index}
								className={index < tournament.phases[phase].numberQualifiedByGroup! ? "bg-green-100 text-black" : ""}
							>
								{index < tournament.phases[phase].numberQualifiedByGroup! ?
									<td className="px-5 border-l-8 border-l-green-500">{team.position}</td> : <td className="px-6 py-4">{team.position}</td>
								}

								<td className="px-6 py-4 text-center uppercase font-bold">{team.team}</td>
								{detailsLevel > 1 && <>
									<td className="px-6 py-4 text-center">{team.numberWin}</td>
									<td className="px-6 py-4 text-center">{team.numberDraw}</td>
									<td className="px-6 py-4 text-center">{team.numberLose}</td>
								</>}

								{detailsLevel > 0 && <>
									<td className="px-6 py-4 text-center">{team.goalScored}</td>
									<td className="px-6 py-4 text-center">{team.goalTaken}</td>
								</>}

								<td className="px-6 py-4 text-center">
									{team.goalScored - team.goalTaken}
								</td>
								<td className="px-4 py-2 text-center">{team.points}</td>
							</tr>
						))}
					</tbody>
				</table>
		</div></>
	)
}