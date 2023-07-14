import { FaUsers } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import { Group } from "../../models/Group";

interface Props {
	groups: Group[];
	handleClickGroup: (index: number) => void;
}

export const GroupsList : React.FC<Props> = ({groups, handleClickGroup}) => (
	<div className="grid grid-cols-1 gap-4 mb-6">
		{groups.map((group, index) => (
			<div
				key={index}
				className="bg-white rounded-lg shadow-lg px-6 py-6 text-gray-800 cursor-pointer hover:shadow-2xl transition-shadow duration-200"
				onClick={() => handleClickGroup(index)}
			>
				<div className="flex justify-between items-center mb-2">
					<h2 className="font-bold text-2xl text-primary">Poule {index + 1}</h2>
					<MdGroup className="text-2xl text-gray-500" />
				</div>
				<div className="grid grid-cols-1">
					{group.teams.map((team, teamIndex) => (
						<div
							key={team}
							className={`bg-gray-${teamIndex % 2 === 0 ? "50" : "100"} rounded-md px-2 py-4`}
						>
							<div className="flex items-center">
								<FaUsers className="text-lg text-gray-500 mr-2" />
								<div className="text-base text-gray-800">{team}</div>
							</div>
						</div>
					))}
				</div>
			</div>
		))}
	</div>
);
