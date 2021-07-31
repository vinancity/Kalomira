import React from "react";

import { StakeModal } from "./StakeModal";
import { UnstakeModal } from "./UnstakeModal";

export function FarmCard(props) {

    return(
        <div className="card bg-light mb-3 mt-2 border border-secondary">
                <div className="card-header">
                    <div className="row">
                        <div className="col">
                            <h6 className="text-dark">FARM</h6>
                        </div>
                        <div className="col">
                            <h6 className="text-dark">Earned</h6>
                        </div>
                        <div className="col">
                            <h6 className="text-dark">Multiplier</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h6 className="text-secondary">{props.LP_data[props.pid].name}</h6>
                        </div>
                        <div className="col">
                            <h6 className="text-secondary">{(props.pendingRewards[props.pid]/(10**18)).toString()}</h6>
                        </div>
                        <div className="col">
                            <h6 className="text-secondary">{"1x"}</h6>
                        </div>
                    </div>
                </div>

                <div className="card-body ">
                    <div className="row">
                        <div className="col">
                            <div className="container border border-secondary-50 rounded">
                            <div className="row">
                                        <div className="col-6">
                                            <h6 className="card-title text-dark m1-2 mt-2 ">KALO EARNED</h6>
                                            <h6 className="text-secondary m1-2">{(props.pendingRewards[props.pid]/(10**18)).toFixed(18)}</h6>
                                        </div>
                                        <div className="col p-3">
                                            <button className="btn btn-primary float-right">Harvest</button>
                                        </div>
                                    </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="container border border-secondary-50 rounded">
                                <div className="row">
                                    <div className="col-6">
                                        <h6 className="card-title text-dark m1-2 mt-2">{props.LP_data[props.pid].name}</h6>
                                        <h6 className="text-secondary m1-2">{(props.userInfo[props.pid].amount/(10**18)).toFixed(5)}</h6>
                                    </div>
                                    <div className="col p-3">                       
                                        <StakeModal stakeLP={(amount) => props.stakeLP(props.pid, amount)}/>                                    
                                        <UnstakeModal unstakeLP={(amount) => props.unstakeLP(props.pid, amount)}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>

    )
}