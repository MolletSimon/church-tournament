import {FaMapMarkerAlt} from "react-icons/fa";
import {AiOutlineClockCircle} from "react-icons/ai";
import React from "react";
import {Match} from "../../models/Match";

interface Props {
	teamWon : (team : string, match : Match) => string,
	m: Match
}

export const MatchMobileComponent: React.FC<Props> = ({teamWon, m}) => {
	return (
		<div className="flex flex-col py-2">
			<div className={`text-lg pb-4  flex justify-between ${teamWon(m.teams[0], m)}`}>
				<p className="w-1/3">{m.teams[0]}</p>
				{m.score1 !== undefined && m.score1 !== null ? <p>{m.score1}</p> : <div className="flex items-center">
					<FaMapMarkerAlt className="text-primary text-sm mr-2" />
					<p className="text-sm italic text-primary">Terrain :{m.field || "à déterminer"}</p> </div>}
			</div>
			<div className={`text-lg flex justify-between ${teamWon(m.teams[1], m)}`}>
				<p className="w-2/5">{m.teams[1]}</p>
				{m.score2 !== undefined && m.score2 !== null ? <p>{m.score2}</p> : <div className="flex items-center">
					<AiOutlineClockCircle className="text-primary mr-2 text-sm" />
					<p className="text-sm italic text-primary">{m.hour || "à déterminer"}</p>
				</div>}
			</div>
		</div>
	)
}