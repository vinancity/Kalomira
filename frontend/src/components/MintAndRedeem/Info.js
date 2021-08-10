import React from "react"

export function Info({ type, rate, amount }) {

    const mintStyle = {
        margin: "0",
        textIndent: "67px"
    }
    const redeemStyle = {
        margin: "0",
        textIndent: "90px"
    }

    return (
        <div>
            <p>{type === "mint" ? "Mint" : "Redeem"} rate:
                <span className="font-weight-bold font-italic">
                    {" " + rate + " "}
                </span>
                {"ibKAI/KAI"}
            </p>
            <p style={{ margin: "0" }}>
                {type === "mint" ? "Mint" : "Redeem"} fee:
                <span className="font-weight-bold font-italic">
                    {" 0.1% "}
                </span>
                {"KAI"}
            </p>
            <p style={type === "mint" ? mintStyle : redeemStyle}>
                <span className="font-weight-bold font-italic">
                    {" 0.05% "}
                </span>
                {"for KALO holder"}
            </p>
            <p style={type === "mint" ? mintStyle : redeemStyle}>
                <span className="font-weight-bold font-italic">
                    {" 0.05% "}
                </span>
                {"for developer wallet"}
            </p>
            
            <br />

            <div className="form-group">
                <label>Amount to {type}:</label>
                <div className="row">
                    <div className="col">
                        <input
                            style={{ background: "white", color: "green" }}
                            type="number"
                            id="disabledTextInput"
                            className="form-control"
                            placeholder={amount}
                            readOnly
                        />
                    </div>
                    <div className="col-1 p-1">
                        <b>{type === "mint" ? "ibKAI" : "KAI"}</b>
                    </div>
                </div>
            </div>
        </div>
    );
}