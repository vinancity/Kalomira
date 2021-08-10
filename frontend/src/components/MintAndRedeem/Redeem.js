import React, { useState } from "react";
import { ethers } from "ethers"

import { Info } from "./Info"

export function Redeem({ redeemKAI, ibKaiContract, ibKaiBal }) {
    const [amt, setAmt] = useState(0);
    const [rate, setRate] = useState(0);

    async function setAmount(amount) {
        if (typeof (amount) != "string") {
            amount = amount.toString()
        }

        let rate, redeemAmt;
        try {
            rate = await ibKaiContract.getRateFromWithdraw(ethers.utils.parseEther(amount))
            redeemAmt = await ibKaiContract.getKAIRedeemAmount(ethers.utils.parseEther(amount))
            console.log(ethers.utils.formatEther(rate)/(10**9))
            console.log(ethers.utils.formatEther(redeemAmt))
            //console.log(ethers.utils.formatEther(redeemAmt)) 
            setRate(ethers.utils.formatEther(rate)/(10**9))
            setAmt(ethers.utils.formatEther(redeemAmt))            
        }
        catch (error) {
            console.log(error)
        }
    }

    function calcRedeem(event) {
        event.preventDefault();
        const amount = event.target.value;
        if (amount) {
            setAmount(amount)
        }
        else { setAmount("0") }
    }

    function maxRedeemInput() {
        let max = ethers.utils.formatEther(ibKaiBal);
        document.getElementById("redeemInput").value = (max);
        setAmount(max);
    }

    return (
        <div className="card-body" >
            <b>REDEEM KAI</b><hr />
            <div className="row">
                <div className="col">
                    <label>Amount of ibKAI to return: </label>
                </div>
                <div className="col-2 p-1">
                    <button className="btn btn-link" onClick={maxRedeemInput}>Max</button>
                </div>
            </div>
            <form onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.target);
                const amount = formData.get("amount");
                if (amount) {
                    redeemKAI(amount);
                }
            }}>
                <div className="form-group">
                    <div className="row">
                        <div className="col">
                            <input
                                id="redeemInput"
                                className="form-control"
                                type="number"
                                step="0.000000000000000001"
                                name="amount"
                                placeholder="0"
                                min="0"
                                onChange={calcRedeem}
                                required
                            />
                        </div>
                        <div className="col-1 p-1">
                            <b>ibKAI</b>
                        </div>
                    </div>
                </div>
                <Info type="redeem" rate={rate} amount={amt} />
                <div>
                    <div className="form-group text-center">
                        <input className="btn btn-primary btn-block" type="submit" value={"Redeem"} />
                    </div>
                </div>
            </form>
        </div>
    );
}