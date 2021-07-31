import React from "react";

import { FarmCard } from "./FarmCard"

export function Farms(props) {
    return (
    <div>
      <h4 className="">KALO Farms</h4>
        <div className="alert alert-dark">
            <FarmCard {...props} pid={0}/>
            
            {/*<FarmCard {...props} pid={1}/>*/}
        </div>        
    </div>
  );
}
