import React, { useState } from 'react';
import 'firebase/firestore';
import RecapTournament from './RecapTournament';
import {Tournament} from "../../../models/Tournament";
import Loader from "../../Common/Loader";
import {db} from "../../../index";
import { addDoc, collection } from 'firebase/firestore';
import {useNavigate} from "react-router-dom";

interface Props {
	tournament: Tournament;
}

const FinalRecap: React.FC<Props> = ({ tournament }) => {
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSaveTournament = async () => {
		setIsLoading(true);

		try {
			const docRef = await addDoc(collection(db, "tournaments"), {
				tournament: tournament,
			});
			console.log("Document written with ID: ", docRef.id);
			navigate("/admin");
		} catch (e) {
			console.error("Error adding document: ", e);
		}

		setIsLoading(false);
	};

	return (
		<>
			<h3 className="text-2xl font-bold text-gray-800 mb-4">
				Voulez-vous enregistrer ce tournoi ?
			</h3>
			<RecapTournament tournament={tournament} />
			<div className="flex justify-center mt-4">
				<button
					className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none"
					onClick={handleSaveTournament}
					disabled={isLoading}
				>
					{isLoading ? <Loader /> : 'Enregistrer'}
				</button>
			</div>
		</>
	);
};

export default FinalRecap;