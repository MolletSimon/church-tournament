import React, { useState } from 'react';
import {Phase} from "../../../models/Phase";

type Props = {
  phase: Phase;
};

const KnockoutPhase: React.FC<Props> = ({ phase }) => {
  return(<>
    <h1>Phase Knockout</h1>
  </>)
};

export default KnockoutPhase;