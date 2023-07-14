import React, {useEffect, useState} from 'react';
import {Phase} from "../../../models/Phase";
import {Match, MatchKnockout} from "../../../models/Match";
import {MatchComponent} from "../common/MatchComponent";
import {Button} from "../../generic/Button";
import {Round} from '../../../models/Enums/Round';
import {Tournament} from "../../../models/Tournament";
import {RankingService} from "../../../services/RankingService";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../index";

type Props = {
  tournament: Tournament;
  setTournament: (phase: Tournament) => void,
};

const KnockoutPhaseComponent: React.FC<Props> = ({ tournament, setTournament }) => {
  const [currentRound, setCurrentRound] = useState<Round>(Round.NONE);
  const [phase, setPhase] = useState(tournament.phases[tournament.currentPhase]);

  const rankingService = new RankingService();

  useEffect(() => {
    setCurrentRound(getRound(phase.knockout?.roundOf!));
  }, [])

  const getNextRound = () => {
    return getRound(phase.knockout?.currentRound! / 2).toString();
  }

  const getLastRound = () => {
    return getRound(phase.knockout?.currentRound! * 2).toString();
  }

  const handleScoreChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number, tab?: boolean) => {
    const newScore = e.target.value ? parseInt(e.target.value) : null;
    const teamIndex = e.target.id.includes("1") ? 0 : 1;
    let newPhase = {...phase};
    let scoreProperty = tab ? `tab${teamIndex + 1}` : `score${teamIndex + 1}`;
    newPhase.knockout!.matches![matchIndex] = {
      ...match,
      [scoreProperty]: newScore,
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

  const handleFieldChange = async (e: React.ChangeEvent<HTMLSelectElement>, match: Match, matchIndex: number) => {
    const newField = e.target.value;
    let newPhase = {...phase};
    newPhase.knockout!.matches![matchIndex] = {
      ...match,
      field: newField,
    } as MatchKnockout;
    tournament.phases[phase.id!] = {...newPhase};
    setPhase(newPhase);
    setTournament(tournament);
  };

  const handleHourChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
    const newHour = e.target.value;
    let newPhase = {...phase};
    newPhase.knockout!.matches![matchIndex] = {
      ...match,
      hour: newHour,
    } as MatchKnockout;
    tournament.phases[phase.id!] = {...newPhase};
    setPhase(newPhase);
    setTournament(tournament);
  };

  const nextPhase = async () => {
    if (phase.knockout!.matches?.find(m => m.round === phase.knockout!.currentRound! / 2)) {
      setCurrentRound(getRound(phase.knockout!.currentRound! / 2))
      setPhase({...phase, knockout: {...phase.knockout, currentRound: phase.knockout!.currentRound! / 2}})
    } else {
      const round = getRound(phase.knockout?.currentRound! / 2)
      const newPhase = {...phase};
      setCurrentRound(round)
      const qualified = phase.knockout?.matches?.filter(m => m.round === phase.knockout?.currentRound!).map(m => {
        return m.winner
      })
      const newRoundOf = phase.knockout?.currentRound! / 2
      newPhase.knockout!.currentRound = newRoundOf
      for (let i = 0; i < qualified!.length; i += 2) {
        newPhase.knockout?.matches?.push({
          round: newRoundOf,
          teams: [qualified![i], qualified![i+1]]
        } as MatchKnockout)
      }

      const newTournament = {...tournament}
      newTournament.phases[tournament.currentPhase] = newPhase
      await setDoc(doc(db, "tournaments", tournament.id!), newTournament)
      setTournament(newTournament)
    }
  };

  const lastPhase = () => {
    setCurrentRound(getRound(phase.knockout!.currentRound! * 2))
    setPhase({...phase, knockout: {...phase.knockout, currentRound: phase.knockout!.currentRound! * 2}})
  };

  return(
      <div className="m-10">

    {phase.knockout?.matches?.map((match, matchIndex) => (
        <>
        {match.round === phase.knockout!.currentRound &&

                <li key={matchIndex} className="py-4 pl-0 flex justify-center m-8 flex-col">
                  <div className="rounded-xl border-2 p-4 hover:scale-110 transition-all">
                    <h2 className="font-bold text-xl m-2 italic">{currentRound}</h2>
                    <MatchComponent tab={match.score1 !== undefined && match.score2 !== undefined && match.score1 === match.score2} handleSaveGame={handleSaveGame} match={match} matchIndex={matchIndex} handleScoreChange={handleScoreChange} handleFieldChange={handleFieldChange} handleHourChange={handleHourChange} />
                  </div>
                </li>

        }
        </>
    ))}
        <div className="flex items-center w-full justify-center gap-4">
          {phase.knockout!.currentRound! < phase.knockout!.roundOf! &&
              <Button color="danger" type="button" action={lastPhase}>Précédent ({getLastRound()}..)</Button>
          }
          {phase.knockout!.matches?.filter(m => m.round === phase.knockout!.currentRound).filter(m => m.round ===  m.score1 === null || m.score1 === undefined || m.score2 === null || m.score2 === undefined || m.winner === "Aucun")?.length! > 0 ?
              <Button color="primary" disabled={true}>Suivant (Validez tous les scores)</Button> : <Button color="primary" type="button" action={nextPhase}>Suivant ({getNextRound()}..)</Button>
          }
          </div>
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

export default KnockoutPhaseComponent;