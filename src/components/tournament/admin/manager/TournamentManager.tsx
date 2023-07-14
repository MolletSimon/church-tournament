import React, { useState } from "react";
import "reactjs-popup/dist/index.css";
import "react-toastify/dist/ReactToastify.css";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { db } from "../../../..";
import { Button } from "../../../generic/Button";
import { GroupPhaseComponent } from "./GroupPhaseComponent";
import KnockoutPhaseComponent from "./KnockoutPhaseComponent";
import { Phase } from "../../../../models/Phase";
import { Tournament } from "../../../../models/Tournament";
import { PhaseService } from "../../../../services/PhaseService";
import { TournamentService } from "../../../../services/TournamentService";
import { TournamentManagerModals } from "./TournamentManagerModals";

export interface Props {
  tournament: Tournament;
  setTournament: (value: Tournament) => void;
}

export const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export const TournamentManager: React.FC<Props> = ({
  tournament,
  setTournament,
}) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalLooserTournamentIsOpen, setLooserTournamentIsOpen] =
    React.useState(false);
  const [looserTournament, setLooserTournament] = useState<Tournament>();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleNextPhase = async (idLooserTournament?: string) => {
    const phaseService = new PhaseService();
    const previousPhase = tournament.phases[tournament.currentPhase];
    let qualified = previousPhase.groups
      ?.map((g, indexG) =>
        g.ranking?.slice(0, previousPhase.numberQualifiedByGroup).map((r) => {
          return { team: r.team, position: r.position, group: indexG };
        })
      )
      .flat();
    const phase = tournament.phases[tournament.currentPhase + 1];
    const teams = qualified!.map((q) => q!.team);
    let newPhases = [] as Phase[];
    if (phase.type === "Poules") {
      newPhases = phaseService.GenerateGroupPhase(phase, tournament, qualified);
    } else {
      newPhases = phaseService.GenerateKnockoutPhase(
        tournament,
        teams,
        qualified
      );
    }

    const tournamentToSave = {
      ...tournament,
      phases: newPhases,
      currentPhase: tournament.currentPhase + 1,
    };
    setTournament(tournamentToSave);
    try {
      if (idLooserTournament)
        tournamentToSave.looserTournament = idLooserTournament;
      await setDoc(doc(db, "tournaments", tournament.id!), {
        ...tournamentToSave,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setIsOpen(false);
  };

  const getQualified = (phase: Phase) => {
    return phase.groups
      ?.map((g, indexG) =>
        g.ranking?.slice(0, phase.numberQualifiedByGroup).map((r) => {
          return { team: r.team, position: r.position, group: indexG };
        })
      )
      .flat();
  };

  const getEliminated = (phase: Phase) => {
    const qualified = getQualified(
      tournament.phases[tournament.currentPhase]
    )?.map((q) => q!.team)!;
    return tournament.teams.filter((item) => !qualified.includes(item));
  };

  const updatePhase = (phase: Phase, index: number) => {
    if (looserTournament) {
      looserTournament.phases[index] = phase;
      setLooserTournament({ ...looserTournament });
    }
  };

  const handleCreateLooserTournament = async () => {
    const lTournament = {
      currentPhase: 0,
      name: tournament.name + " - Consolante",
      dateTournament: tournament.dateTournament,
      status: "started",
      numberTeams: getEliminated(tournament.phases[tournament.currentPhase])
        .length,
      teams: getEliminated(tournament.phases[tournament.currentPhase]),
      phases: [
        {
          type: "Poules",
          name: "Poules",
          numberGroups: 2,
          isHomeAndAway: false,
          numberTeamsByGroup: 4,
          numberQualifiedByGroup: 2,
        },
        {
          type: "Elimination directe",
          name: "Phases finales",
        },
      ] as Phase[],
    } as Tournament;

    const tournamentService = new TournamentService();
    lTournament.phases = tournamentService.GeneratePhase(lTournament, [
      getEliminated(tournament.phases[tournament.currentPhase]).slice(0, 4),
      getEliminated(tournament.phases[tournament.currentPhase]).slice(4, 8),
    ]);
    console.log(lTournament);

    setLooserTournament(lTournament);
    await handleSaveLooserTournament(lTournament);
    /*setLooserTournamentIsOpen(true);*/
  };

  const CustomToastWithLink = () => (
    <div>
      <p>
        Votre tournoi a bien été créé ! Il s'est ouvert dans un nouvel onglet.
      </p>
    </div>
  );

  const handleSaveLooserTournament = async (lTournament: Tournament) => {
    try {
      if (tournament.currentPhase === 0) {
        const docRef = await addDoc(collection(db, "tournaments"), lTournament);
        await setDoc(doc(db, "tournaments", docRef.id), {
          ...lTournament,
          id: docRef.id,
        });
        setLooserTournamentIsOpen(false);
        toast.success(CustomToastWithLink, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        window.open(`/tournament/${docRef.id}`, "_blank", "noreferrer");
        await handleNextPhase(docRef.id);
      } else {
        await handleNextPhase();
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      {/* MODAL */}
      <TournamentManagerModals closeModal={closeModal} modalIsOpen={modalIsOpen} tournament={tournament} getQualified={getQualified} getEliminated={getEliminated} handleCreateLooserTournament={handleCreateLooserTournament} modalLooserTournamentIsOpen={modalLooserTournamentIsOpen} setLooserTournamentIsOpen={setLooserTournamentIsOpen} looserTournament={looserTournament} setLooserTournament={setLooserTournament} updatePhase={updatePhase} />

      <div className="flex justify-between mt-8 px-4 sm:px-0 sm:mx-20">
        <h1 className="font-bold text-primary text-3xl self-center">
          {tournament.name} - Phase :{" "}
          {tournament.phases[tournament.currentPhase]?.name}
        </h1>
        <Link to={`historique`}>
          <Button color="primary">Historique</Button>
        </Link>
      </div>
      {tournament.phases[tournament.currentPhase]?.type === "Poules" ? (
        <GroupPhaseComponent
          handleNextPhase={openModal}
          tournament={tournament}
          setTournament={setTournament}
        />
      ) : (
        <KnockoutPhaseComponent
          setTournament={setTournament}
          tournament={tournament}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};


