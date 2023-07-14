import { Tournament } from "../../../../models/Tournament";
import { ChangeEvent, useState } from "react";

interface TeamListProps {
	tournament: Tournament;
	handleClick: (team: string) => void;
}
export const TeamList: React.FC<TeamListProps> = ({ tournament, handleClick }) => {
	const [teamsDisplayed, setTeamsDisplayed] = useState(tournament.teams);

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setTeamsDisplayed(tournament.teams.filter(t => t.toUpperCase().includes(e.target.value.toUpperCase())));
	};

	return (
		<div>
			<input type="text" placeholder="Chercher une équipe..." className="p-4 italic rounded-full w-full mt-8" onChange={handleSearch} />
			<div className="grid grid-cols-4 gap-4 mt-8">
				{teamsDisplayed && teamsDisplayed.map(team => (
					<div
						className="flex items-center justify-center p-4 rounded-full text-primary border-2 border-primary
						bg-primary bg-opacity-5 hover:bg-opacity-20 cursor-pointer hover:scale-110 transition-all"
						key={team}
						onClick={() => handleClick(team)}
					>
						<p>{team}</p>
					</div>
				))}
			</div>

		</div>
	);
};
