import React from "react";
//import { Confirmation } from "./Confirmation.js"

export function Frontpage({ changeState }) {

    function page(str) {
        changeState(str);        
    }

    return (
    <div>
      <h4>Welcome! What would you like to do today?</h4>
        <div className="alert alert-dark">
          <div className="btn">
            <button className="btn btn-success" type="button" onClick={() => page("stake")}>Stake</button>
          </div>
          <div className="btn">
            <button className="btn btn-primary" type="button" onClick={() => page("withdraw")}>Withdraw Yield</button>
          </div>
          <div className="btn">
            <button className="btn btn-danger" type="button" onClick={() => page("unstake")}>Unstake</button>
          </div>
        </div>
        
        <div className="alert alert-dark">          
          {/*
          <div className="btn" role="group">
            <button className="btn btn-warning" type="button" onClick={() => page("transfer")}>Transfer</button>
          </div>
          */}

          <div className="btn">
            <button type="button" className="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Transfer
            </button>
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => page("transferKAL")}>Transfer KAL</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item" onClick={() => page("transferKAI")}>Transfer KAI</div>
            </div>
          </div>

          <div className="btn">
            <button className="btn btn-info" type="button" onClick={() => page("exchange")}>Exchange</button>
          </div>
          {/*
          <div className="btn">
            <Confirmation />
          </div>
          */}
        </div>     
      
    </div>
  );
}
