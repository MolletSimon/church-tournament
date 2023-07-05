import React from "react";
import {Match} from "../../models/Match";

interface Props {
	match: Match,
	matchIndex: number,
	handleScoreChange: (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => void,
	handleFieldChange: (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => void,
	handleHourChange: (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => void,
	handleSaveGame?: () => void
}

export const MatchComponent: React.FC<Props> = ({match, matchIndex, handleScoreChange, handleFieldChange, handleHourChange, handleSaveGame}) => {
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
						className="w-20 border border-gray-300 rounded-md text-lg text-primary font-bold py-2 px-3 text-center"
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
						className="w-20 border border-gray-300 rounded-md text-lg text-primary font-bold py-2 px-3 text-center"
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
					<input
						type="text"
						id="field"
						onBlur={handleSaveGame}
						onChange={(e) =>
							handleFieldChange(e, match, matchIndex)
						}
						className="w-40 border border-gray-300 rounded-md text-lg text-primary italic py-2 px-3 text-center"
						value={match.field != null ? match.field : ""}
						placeholder="Terrain"
					/>
					<input
						type="text"
						id="hour"
						onBlur={handleSaveGame}
						onChange={(e) =>
							handleHourChange(e, match, matchIndex)
						}
						className="w-24 border border-gray-300 rounded-md text-lg text-primary italic py-2 px-3 text-center"
						value={match.hour != null ? match.hour : ""}
						placeholder="Heure"
					/>
				</div>
			</div>
		</div>
	)
}