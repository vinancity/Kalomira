import React from "react";

import { StakeModal } from "./StakeModal";
import { UnstakeModal } from "./UnstakeModal";

export function FarmCard(props) {
    const style = {
        color: '#006600'
    }
    async function setId() {
        await props.setId(props.pid);
    }

    return (
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
                        <h6 style={style}>{props.lp_data[props.pid].name}</h6>
                    </div>
                    <div className="col">
                        <h6 style={style}>{(props.pendingRewards[props.pid] / (10 ** 18)).toFixed(18)}</h6>
                    </div>
                    <div className="col">
                        <h6 style={style}>{(props.pools[props.pid].allocPoint.toString()) + "x"}</h6>
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
                                    <h6 className="text-secondary m1-2">{(props.pendingRewards[props.pid] / (10 ** 18)).toFixed(18)}</h6>
                                </div>
                                <div className="col p-3">
                                    <button className="btn btn-primary float-right"
                                        onClick={async () => {
                                            await setId();
                                            props.harvestYield();
                                        }}>
                                        Harvest
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="container border border-secondary-50 rounded">
                            <div className="row">
                                <div className="col-6">
                                    <h6 className="card-title text-dark m1-2 mt-2">{props.lp_data[props.pid].name}</h6>
                                    <h6 className="text-secondary m1-2">{(props.userInfo[props.pid].amount / (10 ** 18)).toFixed(5)}</h6>
                                </div>
                                <div className="col p-3">
                                    <StakeModal stakeLP={(amount) => props.stakeLP(amount)} setId={(id) => setId(id)} id={props.pid} />
                                    <UnstakeModal unstakeLP={(amount) => props.unstakeLP(amount)} setId={(id) => setId(id)} id={props.pid} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}