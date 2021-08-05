import React from "react";

export function Redeem() {
    return (
        <div className="card-body" >
            <b>Redeem KAI</b><hr />
            <form onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.target);
                const amount = formData.get("amount");
                if (amount) {

                }
            }}>
                <div className="form-group">
                    <label>Amount to redeem</label>
                    <div className="row">
                        <div className="col">
                            <input
                                className="form-control"
                                type="number"
                                step="1"
                                name="amount"
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>
                        <div className="col-1 p-1">
                            <b>KAI</b>
                        </div>
                    </div>
                </div>
                <div className>
                    <div className="form-group">
                        <input className="btn btn-primary" type="submit" value={"Confirm"} />
                    </div>
                </div>
            </form>
        </div>

    );
}