interface Props {
	selectedTab: string;
	setSelectedTab: (value: "teams" | "groups") => void;
}

export const TabsHomeUser:React.FC<Props> = ({selectedTab, setSelectedTab}) => {
	return (
		<div className="flex justify-center py-2 mb-2 gap-8">
			<button
				className={`${selectedTab === "teams"
						? "bg-primary text-white"
						: "bg-white text-primary"} py-4 px-6 rounded-full focus:outline-none flex justify-between gap-4 items-center transition-colors duration-200`}
				onClick={() => setSelectedTab("teams")}
			>
				<img src="images/football-team.png" width={30} alt="football-team" />
				Équipes
			</button>
			<button
				className={`${selectedTab === "groups"
						? "bg-primary text-white"
						: "bg-white text-primary"} py-4 px-6 rounded-full focus:outline-none flex justify-between gap-4 items-center transition-colors duration-200`}
				onClick={() => setSelectedTab("groups")}
			>
				<img src="images/soccer-ball.png" width={30} alt="soccer-ball" />
				Groupes
			</button>
		</div>
	);
};
