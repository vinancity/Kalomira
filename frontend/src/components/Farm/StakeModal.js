import React from "react";

export function StakeModal({ stakeLP, setId, id }) {  
    return (
      <>
        <button type="button" className="btn btn-success float-right ml-2" data-toggle="modal" data-target="#StakeModal" onClick={() => setId(id)}>
          Stake
        </button>
        <div className="modal fade" id="StakeModal" tabIndex="-1" role="dialog" aria-labelledby="StakeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                  <h5 className="modal-title" id="StakeModalLabel">Stake LP Tokens</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              
              <form onSubmit={(event) => {
                  event.preventDefault();

                  const formData = new FormData(event.target);
                  const amount = formData.get("amount");

                  if (amount) {
                    stakeLP(amount);
                  }
                }}>
                <div className="modal-body">
                    <div className="form-group">
                      <label>Amount to stake</label>
                      <input
                        className="form-control"
                        type="number"
                        step="0.000000000000000001"
                        name="amount"
                        placeholder="1"
                        min="0"
                        required
                      />
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <div className="form-group">
                      <input className="btn btn-primary" type="submit" value={"Confirm"} />
                    </div>
                </div>
              </form>
            </div>
        </div>
        </div>
      </>
    );
  }
