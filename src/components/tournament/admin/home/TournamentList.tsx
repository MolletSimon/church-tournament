import React from "react";
import { Tournament } from "../../../../models/Tournament";
import Loader from "../../../generic/Loader";

interface Props {
	tournaments: Tournament[];
	handleClick: (tournament: Tournament) => void;
}

export const TournamentList: React.FC<Props> = ({tournaments, handleClick}) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-16 gap-6">
			{tournaments ? (
				tournaments.map((t) => (
					<div
						key={t.id}
						id={t.name}
						onClick={() => handleClick(t)}
						className="bg-gray-100 p-6 rounded-xl flex flex-col justify-center items-center shadow-lg cursor-pointer hover:scale-110 transform transition-all"
					>
						<h3 className="text-xl font-bold mb-2 text-primary">{t.name}</h3>
						<p>{t.dateTournament?.toLocaleDateString()}</p>

						<p className="text-lg mb-2">Nombre d'équipes : {t.numberTeams}</p>
						<span
							className={`text-sm font-semibold uppercase mt-2 py-1 px-2 rounded ${t.status === "init"
									? "bg-warning text-white"
									: t.status === "started"
										? "bg-primary text-white"
										: "bg-primary text-white"}`}
						>
							{t.status === "init" && <p>Initié</p>}
							{t.status === "drawMade" && <p>TAS Effectué - Prêt à lancer</p>}
							{t.status === "started" && <p>Démarré</p>}
						</span>
					</div>
				))
			) : (
				<Loader />
			)}
		</div>
	);
}
