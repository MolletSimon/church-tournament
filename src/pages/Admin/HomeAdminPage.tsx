import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Tournament } from "../../models/Tournament";
import { Button } from "../../components/generic/Button";
import { TournamentService } from "../../services/TournamentService";
import { TournamentList } from "../../components/tournament/admin/home/TournamentList";

export const HomeAdminPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const tournamentService = new TournamentService();
  const navigate = useNavigate();

  useEffect(() => {
      tournamentService.FetchTournaments().then((data) => {
        setTournaments(data);
      });
    
  }, []);

  const handleClick = (tournament: Tournament) => {
    navigate(`../tournament/${tournament.id}`);
  };

  return (
    <>
      <Button
        id="createTournament"
        additionalClass="my-8 mx-20"
        color="primary"
        action={() => navigate("/admin/create-tournament")}
      >
        Créer un tournoi
      </Button>

      <TournamentList
        tournaments={tournaments}
        handleClick={handleClick}
      ></TournamentList>
    </>
  );
};
