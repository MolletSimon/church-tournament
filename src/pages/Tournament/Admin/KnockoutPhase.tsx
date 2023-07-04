import React, {useEffect, useState} from 'react';
import {Phase} from "../../../models/Phase";
import {Match, MatchKnockout} from "../../../models/Match";
import {MatchComponent} from "../../../components/tournament/MatchComponent";
import {Button} from "../../../components/generic/Button";
import {Round} from '../../../models/Enums/Round';
import {Tournament} from "../../../models/Tournament";
import {RankingService} from "../../../services/RankingService";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../index";

type Props = {
  tournament: Tournament;
  setTournament: (phase: Tournament) => void,
};

const KnockoutPhase: React.FC<Props> = ({ tournament, setTournament }) => {
  const [currentRound, setCurrentRound] = useState<Round>(Round.NONE);
  const [phase, setPhase] = useState(tournament.phases[tournament.currentPhase]);
  const rankingService = new RankingService();

  useEffect(() => {
    setCurrentRound(getRound(phase.knockout?.roundOf!));
  }, [])

  const getNextRound = () => {
    return getRound(phase.knockout?.roundOf! / 2).toString();
  }

  const getLastRound = () => {
    return getRound(phase.knockout?.roundOf! * 2).toString();
  }

  const handleScoreChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
    const newScore = e.target.value ? parseInt(e.target.value) : null;
    const teamIndex = e.target.id === "score1" ? 0 : 1;
    let newPhase = {...phase};
    newPhase.knockout!.matches![matchIndex] = {
      ...match,
      [`score${teamIndex + 1}`]: newScore,
      round: phase.knockout?.roundOf!
    } as MatchKnockout;
    tournament.phases[phase.id!] = {...newPhase};
    setPhase(newPhase);
    setTournament(tournament);
  };

  const handleSaveGame = async () => {
    const updateTournament = { ...tournament };
    updateTournament!.phases![tournament.currentPhase]!.knockout!.matches!.forEach(match => {
      if (match.score1 != null && match.score2 != null) {
        match = rankingService.DetermineWinner(match) as MatchKnockout;
      }
    })
    await setDoc(doc(db, "tournaments", tournament.id!), updateTournament);
    setTournament(updateTournament);
  }

  const handleFieldChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
    const newField = e.target.value;
    const newMatch = { ...match, field: newField };
  };

  const handleHourChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
    const newHour = e.target.value;
    const newMatch = { ...match, hour: newHour };
  };

  const nextPhase = () => {
    const round = getRound(phase.knockout?.roundOf! / 2)
    const newPhase = {...phase};
    setCurrentRound(round)
    const qualified = phase.knockout?.matches?.filter(m => m.round === phase.knockout?.roundOf!).map(m => {
      return m.winner
    })
    const newRoundOf = phase.knockout?.roundOf! / 2
    newPhase.knockout!.roundOf = newRoundOf
    newPhase.knockout?.matches?.push({
      round: newRoundOf,
      teams: qualified
    } as MatchKnockout)
  };

  return(
      <div className="m-10">

    {phase.knockout?.matches?.map((match, matchIndex) => (
        <>
        {match.round === phase.knockout!.roundOf &&

                <li key={matchIndex} className="py-4 pl-0 flex justify-center m-8 flex-col">
                  <div className="rounded-xl border-2 p-4 hover:scale-110 transition-all">
                    <h2 className="font-bold text-xl m-2 italic">{currentRound}</h2>
                    <MatchComponent handleSaveGame={handleSaveGame} match={match} matchIndex={matchIndex} handleScoreChange={handleScoreChange} handleFieldChange={handleFieldChange} handleHourChange={handleHourChange} />
                  </div>
                </li>

        }
        </>
    ))}
        <div className="flex items-center w-full justify-center gap-4">
          <Button text={`Précédent (${getLastRound()}..)` } color="danger" type="button" action={nextPhase} />
          <Button text={`Suivant (${getNextRound()}..)`} color="primary" type="button" action={nextPhase} /></div>
  </div>
  )
};

export const getRound = (roundOf: number): Round => {
  switch (roundOf) {
    case 8:
      return Round.HUITIEME;
    case 4:
      return Round.QUART;
    case 2:
      return Round.DEMI;
    case 1:
      return Round.FINALE;
    default:
      return Round.NONE
  }
}

export default KnockoutPhase;