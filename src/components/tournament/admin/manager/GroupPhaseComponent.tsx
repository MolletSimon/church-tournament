import { Button } from "../../../generic/Button";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RankingService } from "../../../../services/RankingService";
import { Match } from "../../../../models/Match";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../index";
import { Tournament } from "../../../../models/Tournament";
import { MatchComponent } from "../../common/MatchComponent";
import { RankingComponent } from "../../common/RankingComponent";
import "firebase/firestore";
import { NotifyUser } from "../../../../services/NotificationService";
import {formatTeamName, formatTeamNameFullInfos} from "../../../../utils/utils";

interface Props {
  tournament: Tournament;
  setTournament: (value: Tournament) => void;
  handleNextPhase: () => void;
}

export const GroupPhaseComponent: React.FC<Props> = ({
  tournament,
  setTournament,
  handleNextPhase,
}) => {
  let groups = tournament.phases[tournament.currentPhase].groups!;
  const navigate = useNavigate();
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);
  let rankingService = new RankingService();
  const [selectedGroup, setSelectedGroup] = useState(
    groups[selectedGroupIndex]
  );
  const [matchesDisplayed, setMatchDisplayed] = useState(selectedGroup.matches);
  const [activeTab, setActiveTab] = useState<"match" | "rank">("match");

  useEffect(() => {
    groups = tournament.phases[tournament.currentPhase].groups!;
    setSelectedGroup(groups[0]);
    setMatchDisplayed(groups[0].matches);
  }, [tournament.currentPhase, tournament.phases]);

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let newIndex = parseInt(event.target.value);
    setSelectedGroupIndex(newIndex);
    const matches = groups[newIndex].matches;

    const updatedMatches = matches.map((match, matchIndex) => {
      const updatedMatch = matches[matchIndex];
      return {
        ...match,
        score1: updatedMatch.score1 !== undefined ? updatedMatch.score1 : null,
        score2: updatedMatch.score2 !== undefined ? updatedMatch.score2 : null,
      };
    });
    setSelectedGroup({ ...groups[newIndex], matches: updatedMatches });
    setMatchDisplayed(updatedMatches);
  };

  const handleScoreChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    match: Match,
    matchIndex: number
  ) => {
    const newScore = e.target.value ? parseInt(e.target.value) : null;
    const teamIndex = e.target.id === "score1" ? 0 : 1;
    const newMatch = { ...match, [`score${teamIndex + 1}`]: newScore };
    updateMatch(newMatch, matchIndex);
  };

  const handleFieldChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    match: Match,
    matchIndex: number
  ) => {
    const newField = e.target.value;
    const newMatch = { ...match, field: newField };
    match.teams.forEach((team, index) => {
      NotifyUser(`Ton prochain match aura lieu sur le terrain : ${newField}, Bon match ! ⚽️`, "On a ton terrain ! 🏟️", formatTeamNameFullInfos(team));
    });
    updateMatch(newMatch, matchIndex);
  };

  const handleHourChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    match: Match,
    matchIndex: number
  ) => {
    const newHour = e.target.value;
    const newMatch = { ...match, hour: newHour };
    updateMatch(newMatch, matchIndex);
    match.teams.forEach((team, index) => {
      NotifyUser(`Ton prochain match aura lieu à ${newHour} heures !`, "Tic tac, tu joues bientôt ! ⏰", formatTeamNameFullInfos(team));
    });
  };

  const updateMatch = (newMatch: Match, matchIndex: number) => {
    let updateTournament = { ...tournament };
    const group =
      updateTournament.phases[tournament.currentPhase].groups![
        selectedGroupIndex
      ];
    group.matches[matchIndex] = newMatch;
    setSelectedGroup(group);

    newMatch = rankingService.DetermineWinner(newMatch);

    updateTournament.phases[updateTournament.currentPhase].groups![
      selectedGroupIndex
    ].ranking = rankingService.ComputeRanking(
      selectedGroup.teams,
      updateTournament,
      selectedGroupIndex
    );
    setMatchDisplayed(group.matches);
    setTournament(updateTournament);
  };

  const handleSaveGame = async () => {
    const updateTournament = { ...tournament };
    const group =
      updateTournament.phases[tournament.currentPhase].groups![
        selectedGroupIndex
      ];
    group.matches = selectedGroup.matches;

    group.matches.forEach((match) => {
      if (match.score1 != null && match.score2 != null) {
        match = rankingService.DetermineWinner(match);
        rankingService.ComputeRanking(
          selectedGroup.teams,
          updateTournament,
          selectedGroupIndex
        );
      }
    });
    
    await setDoc(doc(db, "tournaments", tournament.id!), updateTournament);
    setTournament(updateTournament);
  };

  const handlePrecPhase = async () => {
    const updateTournament = { ...tournament };
    updateTournament.currentPhase = updateTournament.currentPhase - 1;
    await setDoc(doc(db, "tournaments", tournament.id!), updateTournament);
    setTournament(updateTournament);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    let teams = { ...selectedGroup }.matches
      .flatMap((m) => m.teams)
      .filter((m) => m.toUpperCase().includes(e.target.value.toUpperCase()));
    teams = teams.filter(function (item, pos) {
      return teams.indexOf(item) === pos;
    });

    const filteredMatches = selectedGroup.matches.filter((match) =>
      match.teams.some((team) => teams.includes(team))
    );
    setMatchDisplayed(filteredMatches);
  };

  const tabSelector = () => {
    return (
      <div className="flex space-x-6 m-10">
        {tab("Matches / Résultats", activeTab === "match", "match")}
        {tab("Classement", activeTab === "rank", "rank")}
      </div>
    );
  };

  const tab = (text: string, selected: boolean, tabName: "match" | "rank") => {
    return (
      <h3
        onClick={() => setActiveTab(tabName)}
        className={`cursor-pointer text-xl hover:scale-110 transition-all hover:font-bold ${
          selected ? "text-primary font-bold underline" : ""
        } `}
      >
        {text}
      </h3>
    );
  };

  return (
    <>
      <div className="space-y-6 px-4 sm:mx-16 mt-20">
        <div className="flex items-center space-x-2">
          <label htmlFor="group" className="font-medium text-gray-700">
            Groupe
          </label>
          <select
            id="group"
            name="group"
            className="px-3 pr-10 py-2 text-base border-primary bg-primary text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            value={selectedGroupIndex}
            onChange={handleGroupChange}
          >
            {groups.map((group, index) => (
              <option key={index} value={index}>
                {`Groupe ${index + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div className="w-2/3">
          {/*<input*/}
          {/*  type="text"*/}
          {/*  placeholder="Chercher par équipe"*/}
          {/*  className="mb-8 rounded-full border-opacity-20 focus:border-opacity-100 focus:border-primary w-full italic p-4 border-2 border-primary"*/}
          {/*  onChange={handleSearch}*/}
          {/*/>*/}
        </div>

        {tabSelector()}

        {activeTab === "match" && (
          <div className="sm:flex-row w-full justify-between items-start">
            <ul className="divide-y divide-gray-200 p-4 px-8 rounded-xl mt-6 sm:w-auto">
              {matchesDisplayed.map((match, matchIndex) => (
                <li
                  key={matchIndex}
                  className="py-4 pl-0 flex justify-center w-full"
                >
                  <div className="rounded-xl border-2 p-4 py-8 hover:scale-110 transition-all w-full">
                    <MatchComponent
                      handleSaveGame={handleSaveGame}
                      match={match}
                      matchIndex={matchIndex}
                      handleScoreChange={handleScoreChange}
                      handleFieldChange={handleFieldChange}
                      handleHourChange={handleHourChange}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "rank" && (
          <div className="flex justify-center items-center w-full p-4 m-8 mt-10">
            <div className="flex flex-col w-full ">
              <RankingComponent
                selectedGroup={selectedGroup}
                detailsLevel={2}
                tournament={tournament}
                phase={tournament.currentPhase}
              />
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-end gap-8 mt-10">
          <Button color="danger" action={() => navigate("/")}>
            Retour
          </Button>
          {tournament.currentPhase > 0 && (
            <Button color="warning">Phase précédente</Button>
          )}

          <Button color="primary" action={handleNextPhase}>
            Finaliser cette phase !
          </Button>
        </div>
      </div>
    </>
  );
};
