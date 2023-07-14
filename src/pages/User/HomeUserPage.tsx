import { useState, useEffect, ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { Tournament } from "../../models/Tournament";
import { db } from "../../index";
import { FaUsers } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import { PhaseType } from "../../models/Enums/PhaseType";
import { Button } from "../../components/generic/Button";
import { getRound } from "../../components/tournament/admin/manager/KnockoutPhaseComponent";
import { MatchMobileComponent } from "../../components/mobile/MatchMobileComponent";
import { TabsHomeUser } from "../../components/tournament/TabsHomeUser";

const HomeUserPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [teamsDisplayed, setTeamsDisplayed] = useState<string[]>([]);
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament>();
  const [selectedTab, setSelectedTab] = useState<"teams" | "groups">("teams");

  useEffect(() => {
    const subscriber = onSnapshot(
      doc(db, "tournaments", tournamentId!),
      (doc) => {
        const tournament = doc.data() as Tournament;
        if (tournament.status !== "init") {
          setTournament(tournament);
          const currentPhase = tournament!.phases[tournament.currentPhase];
          if (currentPhase.type === PhaseType.GROUP)
            setTeamsDisplayed(currentPhase.groups!.flatMap((g) => g.teams));
          else setTeamsDisplayed(currentPhase.knockout?.teams!);
        }
      }
    );

    return () => subscriber();
  }, [tournamentId]);

  const handleClickTeam = (teamName: string) => {
    navigate(`/${tournamentId}/${teamName}`);
  };

  const handleClickGroup = (groupId: number) => {
    navigate(`/${tournamentId}/group/${groupId.toString()}`);
  };

  const groups = tournament?.phases[tournament.currentPhase].groups || [];

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setTeamsDisplayed(
      teamsDisplayed!.filter((t) =>
        t.toUpperCase().includes(event.target.value.toUpperCase())
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F9FB]">
      <div className="text-primary py-4 px-8 mb-4 mt-2">
        <h1 className="text-2xl text-center text-primary">
          {tournament?.name}
        </h1>
      </div>
      <TabsHomeUser
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      ></TabsHomeUser>
      <div className="px-4">
        {tournament &&
          tournament.phases[tournament.currentPhase].type === "Poules" && (
            <>
              {selectedTab === "teams" && (
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div className="w-full flex items-center gap-2">
                    <input
                      onChange={handleSearch}
                      className="w-full p-4 rounded-full"
                      type="text"
                      placeholder="Nom de l'équipe.."
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>
                  {teamsDisplayed?.map((team) => (
                    <div
                      key={team}
                      className="bg-white rounded-3xl text-lg px-4 py-10 text-black cursor-pointer hover:shadow-2xl transition-shadow duration-200"
                      onClick={() => handleClickTeam(team)}
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                            />
                          </svg>
                        </div>
                        <h2 className="text-xl italic text-primary">{team}</h2>
                      </div>
                    </div>
                  ))}
                  {tournament?.status === "init" && (
                    <p>Le tournoi est en cours de préparation...</p>
                  )}
                  {tournament && tournament.looserTournament && (
                    <>
                      <p className="italic mx-2 my-4 font-bold">
                        ⚠️ Si votre équipe ne figure pas dans la liste, elle est
                        peut être dans le tournoi consolante. Vous pouvez y
                        accéder à l'aide du bouton ci-dessous...
                      </p>
                      <Link to={`/${tournament.looserTournament}`}>
                        <div className="flex justify-center w-full mb-6">
                          <Button color="primary">
                            Accéder au tournoi consolante
                          </Button>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              )}
              {selectedTab === "groups" && (
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {groups.map((group, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-lg px-6 py-6 text-gray-800 cursor-pointer hover:shadow-2xl transition-shadow duration-200"
                      onClick={() => handleClickGroup(index)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold text-2xl text-primary">
                          Poule {index + 1}
                        </h2>
                        <MdGroup className="text-2xl text-gray-500" />
                      </div>
                      <div className="grid grid-cols-1">
                        {group.teams.map((team, teamIndex) => (
                          <div
                            key={team}
                            className={`bg-gray-${
                              teamIndex % 2 === 0 ? "50" : "100"
                            } rounded-md px-2 py-4`}
                          >
                            <div className="flex items-center">
                              <FaUsers className="text-lg text-gray-500 mr-2" />
                              <div className="text-base text-gray-800">
                                {team}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        {tournament &&
          tournament.phases[tournament.currentPhase].type ===
            "Elimination directe" && (
            <>
              <h3 className="text-xl text-primary">
                Phases finales -{" "}
                {getRound(
                  tournament.phases[tournament.currentPhase]!.knockout!
                    .currentRound!
                )}{" "}
              </h3>
              {tournament.phases[
                tournament.currentPhase
              ]!.knockout!.matches!.filter(
                (m) =>
                  m.round ===
                  tournament.phases[tournament.currentPhase]!.knockout!
                    .currentRound
              ).map((m, i) => (
                <>
                  <div className="m-4 p-4 border-2 rounded-xl border-primary">
                    <MatchMobileComponent teamWon={() => ""} m={m} />
                  </div>
                </>
              ))}
            </>
          )}
      </div>
    </div>
  );
};

export default HomeUserPage;
