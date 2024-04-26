import React, { useState } from "react";
import "firebase/firestore";
import RecapTournament from "./RecapTournament";
import { Tournament } from "../../models/Tournament";
import Loader from "../generic/Loader";
import { auth, db } from "../../index";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "../generic/Button";

interface Props {
  tournament: Tournament;
}

const FinalRecap: React.FC<Props> = ({ tournament }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSaveTournament = async () => {
    setIsLoading(true);

    try {
      // generate 6 random characters uppercase
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const docRef = await addDoc(collection(db, "tournaments"), {
        tournament,
      });
      await setDoc(doc(db, "tournaments", docRef.id), {
        ...tournament,
        id: docRef.id,
        admin: auth.currentUser?.uid,
        code: code,
      });
      navigate("/admin");
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setIsLoading(false);
  };

  return (
    <>
      <h3 className="mb-4 text-2xl font-bold text-gray-800">
        Voulez-vous enregistrer ce tournoi ?
      </h3>
      <RecapTournament tournament={tournament} />
      <div className="mt-4 flex justify-center">
        {isLoading ? (
          <Loader />
        ) : (
          <Button
            color="primary"
            action={handleSaveTournament}
            disabled={isLoading}
          >
            Enregistrer
          </Button>
        )}
      </div>
    </>
  );
};

export default FinalRecap;
