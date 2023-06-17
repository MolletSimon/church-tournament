import React, {useEffect, useState} from 'react';
import {Phase} from "../../../models/Phase";
import {Match} from "../../../models/Match";
import {MatchComponent} from "../../../components/tournament/MatchComponent";

type Props = {
  phase: Phase;
};

enum Round {
  NONE = "N/R",
  HUITIEME = "Huitièmes de finale",
  QUART = "Quarts de finale",
  DEMI = "Demis-finale",
  FINALE = "Finale"
}

const KnockoutPhase: React.FC<Props> = ({ phase }) => {
  const [currentPhase, setCurrentPhase] = useState<Round>(Round.NONE);

  useEffect(() => {
    setCurrentPhase(getRound(phase.knockout?.roundOf!));
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

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
    
  };
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
    
  };
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>, match: Match, matchIndex: number) => {
    
  };
  return(
      <div className="m-10">
    {phase.knockout?.matches?.map((match, matchIndex) => (
        <li key={matchIndex} className="py-4 pl-0 flex justify-center w-2/3 m-8 flex-col">
          <h2 className="font-bold text-xl m-2 italic">{currentPhase} {matchIndex + 1}</h2>
          <MatchComponent match={match} matchIndex={matchIndex} handleScoreChange={handleScoreChange} handleFieldChange={handleFieldChange} handleHourChange={handleHourChange} />
        </li>
    ))}
        <p className="italic m-10 text-primary">Prochaine phase : {getRound(phase.knockout?.roundOf! / 2).toString()}...</p>
  </div>
  )
};

export default KnockoutPhase;