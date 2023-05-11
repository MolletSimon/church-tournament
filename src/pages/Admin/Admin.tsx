import {useNavigate} from "react-router-dom";

export const Admin = () => {
	const navigate = useNavigate();

	return (
		<div className="container mx-auto mt-10">
			<h1 className="text-3xl font-bold mb-8">Page administrateur</h1>
			<div className="flex flex-row">
				<button
					className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					onClick={() => navigate("/create-tournament")}
				>
					Créer un tournoi
				</button>
			</div>
		</div>
	);
}