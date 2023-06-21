import React, {useEffect, useState} from 'react';
import {Phase} from "../../../models/Phase";
import {Match} from "../../../models/Match";
import {MatchComponent} from "../../../components/tournament/MatchComponent";
import {Button} from "../../../components/generic/Button";
import { Round } from '../../../models/Enums/Round';

type Props = {
  phase: Phase;
};

const KnockoutPhase: React.FC<Props> = ({ phase }) => {
  const [currentRound, setCurrentRound] = useState<Round>(Round.NONE);

  useEffect(() => {
    setCurrentRound(getRound(phase.knockout?.roundOf!));
  }, [])

  const getNextPhase = () => {

  }

  const getRound = (roundOf: number): Round => {
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

  const handleScoreChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
    const newScore = e.target.value ? parseInt(e.target.value) : null;
    const teamIndex = e.target.id === "score1" ? 0 : 1;
    const newMatch = { ...match, [`score${teamIndex + 1}`]: newScore };
  };

  const handleFieldChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
    const newField = e.target.value;
    const newMatch = { ...match, field: newField };
  };

  const handleHourChange = async (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
    const newHour = e.target.value;
    const newMatch = { ...match, hour: newHour };
  };
  const nextPhase = () => {
    setCurrentRound(getRound(phase.knockout?.roundOf! / 2))
    phase.knockout!.roundOf = phase.knockout?.roundOf! / 2
  };
  return(
      <div className="m-10">
    {phase.knockout?.matches?.map((match, matchIndex) => (
        <li key={matchIndex} className="py-4 pl-0 flex justify-center w-2/3 m-8 flex-col">
          <div className="rounded-xl border-2 p-4 hover:scale-110 transition-all">
          <h2 className="font-bold text-xl m-2 italic">{currentRound} {matchIndex + 1}</h2>
            <MatchComponent match={match} matchIndex={matchIndex} handleScoreChange={handleScoreChange} handleFieldChange={handleFieldChange} handleHourChange={handleHourChange} />
          </div>
        </li>
    ))}
        <Button text="Suivant" color="primary" type="button" action={nextPhase} />
        <p className="italic m-10 text-primary">Prochaine phase : {getRound(phase.knockout?.roundOf! / 2).toString()}...</p>
  </div>
  )
};

export default KnockoutPhase;