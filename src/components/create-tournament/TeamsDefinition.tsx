import React, { useState } from "react";
import { Tournament } from "../../models/Tournament";
import { Button } from "../generic/Button";
import { Icon } from "../generic/Icon";
import { toast } from "react-toastify";

interface Props {
  setTournament: (value: Tournament) => void;
  tournament: Tournament;
  setIsValid: (value: boolean) => void;
}
export const TeamsDefinition: React.FC<Props> = ({
  setTournament,
  tournament,
  setIsValid,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    if (!inputValue) return;
    if (tournament.teams.includes(inputValue)) {
      setInputValue("");
      toast.error("Cette équipe est déjà dans la liste", {
        theme: "colored",
        pauseOnHover: false,
        hideProgressBar: true,
      });
      return;
    }

    const updatedTeams = [...tournament.teams, inputValue];
    const updatedTournament = {
      ...tournament,
      teams: updatedTeams,
      numberTeams: updatedTeams.length,
    };
    setTournament(updatedTournament);
    setInputValue("");

    // Appeler checkValidity après avoir mis à jour le state tournament
    checkValidity(updatedTeams);
  };

  const checkValidity = (teams: string[]) => {
    if (teams.length > 1) {
      setIsValid(true);
      return;
    }

    if (tournament.teams.length % 2 !== 0) {
      setIsValid(false);
      return;
    }

    setIsValid(false);
  };

  const handleDelete = (indexToDelete: number) => {
    setTournament({
      ...tournament,
      teams: tournament.teams.filter((_, index) => index !== indexToDelete),
      numberTeams: tournament.teams.length - 1,
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSubmit();
  };

  return (
    <>
      <h1 className="mb-4 mt-5 text-xl font-bold italic">Les équipes</h1>
      <div className="mt-5 flex flex-col items-center md:flex-row">
        <input
          type="text"
          className="mb-2 rounded-full border-2 border-gray-200 bg-white px-5 py-3 leading-tight focus:border-blue-500 focus:outline-none md:mb-0 md:mr-4"
          placeholder="Nom de l'équipe"
          id="teamName"
          value={inputValue}
          onChange={handleChange}
          onKeyUp={(e) => handleKeyPress(e)}
        />
        <Button color="primary" action={handleSubmit}>
          Valider
        </Button>
      </div>

      <div className="mx-4 my-8 w-full rounded-lg">
        {tournament.teams && tournament.teams.length > 0 ? (
          <ul className="divide-y divide-gray-300 rounded-xl p-4 shadow-md">
            {tournament.teams.map((e, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-2 transition-all hover:scale-105"
              >
                <span className="pl-4 text-lg font-bold italic text-gray-700">
                  {e}
                </span>
                <Button
                  action={() => handleDelete(index)}
                  color="white"
                  additionalClass=""
                >
                  <Icon icon="trash" size={32}></Icon>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic">
            Entrez le nom d'une équipe puis appuyer sur la touche "Entrée" ou le
            bouton Valider
          </p>
        )}
      </div>
    </>
  );
};
