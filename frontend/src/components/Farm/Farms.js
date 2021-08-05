import React from "react";

import { FarmCard } from "./FarmCard"

export function Farms(props) {  
  const pools = [0, 1, 2]
  return (
    <div>
      <div className="mb-4">
        <h4>KALO Farms</h4>
        <h6>Stake Liquidity Pool (LP) tokens to earn KALO</h6>
      </div>
      <div className="alert alert-dark">
        {pools.map((pid) => {
          return (<FarmCard key={pid} {...props} pid={pid} />);
        })}
      </div>
    </div>
  );
}