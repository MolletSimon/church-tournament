import React from "react";
import {Match} from "../../models/Match";

interface Props {
	match: Match,
	matchIndex: number,
	handleScoreChange: (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number, tab?: boolean) => void,
	handleFieldChange: (e: React.ChangeEvent<HTMLSelectElement>, match: Match, matchIndex: number) => void,
	handleHourChange: (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => void,
	handleSaveGame?: () => void,
	tab?: boolean
}

export const MatchComponent: React.FC<Props> = ({match, matchIndex, handleScoreChange, handleFieldChange, handleHourChange, handleSaveGame, tab}) => {
	return (
		<div className="w-full">
			<div className="flex items-center justify-center space-x-4">
				<div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
					{match.teams[0].charAt(0)}
				</div>
				<div className="w-24 min-w-0">
					<p className="text-sm font-medium text-gray-900">
						{match.teams[0]}
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<input
						type="number"
						onWheel={(e) => e.currentTarget.blur()}
						id="score1"
						onBlur={handleSaveGame}
						onChange={(e) =>
							handleScoreChange(e, match, matchIndex)
						}
						className="w-20 border border-gray-300 rounded-full text-lg text-primary font-bold py-2 px-3 text-center"
						value={match.score1 != null ? match.score1 : ""}
					/>
					<span className="text-sm text-gray-500">-</span>
					<input
						type="number"
						onWheel={(e) => e.currentTarget.blur()}
						id="score2"
						onBlur={handleSaveGame}
						onChange={(e) =>
							handleScoreChange(e, match, matchIndex)
						}
						className="w-20 border border-gray-300 rounded-full text-lg text-primary font-bold py-2 px-3 text-center"
						value={match.score2 != null ? match.score2 : ""}
					/>
				</div>
				<div className="w-24 min-w-0">
					<p className="text-sm font-medium text-gray-900 text-end">
						{match.teams[1]}
					</p>
				</div>
				<div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
					{match.teams[1].charAt(0)}
				</div>
				<div className="flex items-center space-x-2">
					<select name="field" className="border-2 px-6 py-2 rounded-full text-primary" id="field" onBlur={handleSaveGame} value={match.field} onChange={
						(e) => handleFieldChange(e, match, matchIndex)}>
						<option value="">Déterminer le terrain</option>
						<option value="A">Terrain A</option>
						<option value="B">Terrain B</option>
						<option value="C">Terrain C</option>
						<option value="D">Terrain D</option>
					</select>
					<input
						type="text"
						id="hour"
						onBlur={handleSaveGame}
						onChange={(e) =>
							handleHourChange(e, match, matchIndex)
						}
						className="w-24 border border-gray-300 rounded-full text-lg text-primary italic py-2 px-3 text-center"
						value={match.hour != null ? match.hour : ""}
						placeholder="Heure"
					/>
				</div>
			</div>


			{tab &&
				<TabComponent match={match} matchIndex={matchIndex} handleSaveGame={handleSaveGame} handleScoreTabChange={handleScoreChange} />
			}


		</div>
	)
}

interface TabProps {
	match: Match,
	matchIndex: number,
	handleSaveGame?: () => void,
	handleScoreTabChange: (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number, tab: boolean) => void,
}

const TabComponent: React.FC<TabProps> = ({match, handleSaveGame, handleScoreTabChange, matchIndex}) => {
	return(
		<div className="mt-12">
			<h3 className="italic text-center">Tirs aux buts</h3>
			<div className="flex items-center justify-center mt-2 border-2 rounded-xl p-6 w-1/2 mx-auto gap-4">
				<div>
					{match.teams[0]}
				</div>
				<div>
					<input
						type="number"
						onWheel={(e) => e.currentTarget.blur()}
						id="tab1"
						onBlur={handleSaveGame}
						onChange={(e) =>
							handleScoreTabChange(e, match, matchIndex, true)
						}
						className="w-20 border border-gray-300 rounded-md text-lg text-primary font-bold py-2 px-3 text-center"
						value={match.tab1 !== undefined ? match.tab1 : ""}
					/>
				</div>
				<div>
					-
				</div>
				<div>
					<input
						type="number"
						onWheel={(e) => e.currentTarget.blur()}
						id="tab2"
						onBlur={handleSaveGame}
						onChange={(e) =>
							handleScoreTabChange(e, match, matchIndex, true)
						}
						className="w-20 border border-gray-300 rounded-md text-lg text-primary font-bold py-2 px-3 text-center"
						value={match.tab2 !== undefined ? match.tab2 : ""}
					/>
				</div>
				<div>{match.teams[1]}</div>
			</div>
		</div>

	)
}