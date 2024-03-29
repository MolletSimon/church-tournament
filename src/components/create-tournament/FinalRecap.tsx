import React, { useState } from 'react';
import 'firebase/firestore';
import RecapTournament from './RecapTournament';
import {Tournament} from "../../models/Tournament";
import Loader from "../generic/Loader";
import {auth, db} from "../../index";
import {addDoc, collection, doc, setDoc} from 'firebase/firestore';
import {useNavigate} from "react-router-dom";
import {Button} from "../generic/Button";

interface Props {
	tournament: Tournament;
}

const FinalRecap: React.FC<Props> = ({ tournament }) => {
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSaveTournament = async () => {
		setIsLoading(true);

		try {
			const docRef = await addDoc(collection(db, "tournaments"), {tournament});
			await setDoc(doc(db, "tournaments", docRef.id), {...tournament, id: docRef.id, admin: auth.currentUser?.uid});
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
				{isLoading ? <Loader /> : <Button color='primary' action={handleSaveTournament} disabled={isLoading}>Enregistrer</Button>}
			</div>
		</>
	);
};

export default FinalRecap;