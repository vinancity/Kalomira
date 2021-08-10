import React from "react";

import { Mint } from "./Mint"
import { Redeem } from "./Redeem";

export function MintAndRedeem({ mintIBKAI, redeemKAI, ibKaiContract, kaiBal, ibKaiBal}) {
    var mintBtn = document.getElementById("pill-mint")
    var redeemBtn = document.getElementById("pill-redeem")
    var mintBody = document.getElementById("mint-body")
    var redeemBody = document.getElementById("redeem-body")

    function toggleMint() {
        mintBtn.className = "nav-link active"
        redeemBtn.className = "nav-link"
        if (mintBody.style.display === "none") {
            mintBody.style.display = "block"
            redeemBody.style.display = "none"
        }
    }
    function toggleRedeem() {
        mintBtn.className = "nav-link"
        redeemBtn.className = "nav-link active"
        if (redeemBody.style.display === "none") {
            mintBody.style.display = "none"
            redeemBody.style.display = "block"
        }
    }

    return (
        <div>
            <div className="mb-4">
                <h4>Mint and Redeem</h4>
                <h6>Exchange KAI and ibKAI </h6>
            </div>

            <div className="alert alert-dark">
                <div className="card bg-light mb-3 mt-2 border border-secondary">
                    <div className="card-header">
                        <div className="row">
                            <div className="col">
                                <ul className="nav nav-pills nav-justified">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="pill-mint" aria-current="page" href="#mint" onClick={toggleMint}>Mint</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col">
                                <ul className="nav nav-pills nav-justified">
                                    <li className="nav-item">
                                        <a className="nav-link" id="pill-redeem" aria-current="page" href="#redeem" onClick={toggleRedeem}>Redeem</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div id="mint-body" style={{ display: "block" }}>
                        <Mint mintIBKAI={(amount) => mintIBKAI(amount)} ibKaiContract={ibKaiContract} kaiBal={kaiBal} />
                    </div>
                    <div id="redeem-body" style={{ display: "none" }}>
                        <Redeem redeemKAI={(amount) => redeemKAI(amount)} ibKaiContract={ibKaiContract} ibKaiBal={ibKaiBal}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

