import {useNavigate} from "react-router-dom";

export const Admin = () => {
	const navigate = useNavigate();
	return (
		<div className="m-5 p-5">
			<h1 className="title">Page administrateur</h1>
			<div className="columns">
				<div className="column">
					<button className="button" onClick={() => navigate("/create-tournament")}>Créer un tournoi</button>
				</div>
			</div>
		</div>
	)
}