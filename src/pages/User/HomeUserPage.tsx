import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { Tournament } from "../../models/Tournament";
import { db } from "../../index";
import { PhaseType } from "../../models/Enums/PhaseType";
import { getRound } from "../../components/tournament/admin/manager/KnockoutPhaseComponent";
import { MatchMobileComponent } from "../../components/mobile/MatchMobileComponent";
import { TabsHomeUser } from "../../components/tournament/TabsHomeUser";
import { TeamsList } from "../../components/mobile/TeamsList";
import { GroupsList } from "../../components/mobile/GroupsList";

const HomeUserPage = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [teamsDisplayed, setTeamsDisplayed] = useState<string[]>([]);
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament>();
  const groups = tournament?.phases[tournament.currentPhase].groups || [];
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
                <TeamsList
                  teamsDisplayed={teamsDisplayed}
                  tournament={tournament}
                  handleClickTeam={handleClickTeam}
                  handleSearch={handleSearch}
                />
              )}
              {selectedTab === "groups" && (
                <GroupsList
                  groups={groups}
                  handleClickGroup={handleClickGroup}
                ></GroupsList>
              )}
            </>
          )}
        {tournament &&
          tournament.phases[tournament.currentPhase].type ===
            "Elimination directe" && (
            <>
              <h3 className="text-xl text-primary">Phases finales -{" "}{getRound(tournament.phases[tournament.currentPhase]!.knockout!.currentRound!)}</h3>
              {tournament.phases[tournament.currentPhase]!.knockout!.matches!.filter((m) => 
			  	m.round === tournament.phases[tournament.currentPhase]!.knockout!.currentRound).map((m, i) => (
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
