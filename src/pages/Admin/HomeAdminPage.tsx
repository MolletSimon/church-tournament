import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Tournament } from "../../models/Tournament";
import { Header } from "../../components/generic/Header";
import { Button } from "../../components/generic/Button";
import { TournamentService } from "../../services/TournamentService";
import { TournamentList } from "../../components/tournament/admin/home/TournamentList";

export const HomeAdminPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const tournamentService = new TournamentService();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("connected")) {
      tournamentService.FetchTournaments().then((data) => {
		setTournaments(data);
	});
    } else {
      navigate("/login");
    }
  }, []);

  const handleClick = (tournament: Tournament) => {
    navigate(`/tournament/${tournament.id}`);
  };

  return (
    <>
      <Header></Header>
      <Button
        id="createTournament"
        additionalClass="my-8 mx-20"
        color="primary"
        action={() => navigate("/create-tournament")}
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
