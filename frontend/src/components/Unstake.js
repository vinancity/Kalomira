import React from "react";

export function Unstake({ unstakeTokens, tokenSymbol }) {
  return (
    <div>
      <h4>Unstake</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");

          if (amount) {
            unstakeTokens(amount);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of {tokenSymbol} to Unstake</label>
          <input
            className="form-control"
            type="number"
            step="1"
            name="amount"
            placeholder="1"
            required
          />
        </div>
        <div className="form-group">
          <input className="btn btn-danger" type="submit" value="Unstake" />
        </div>

      </form>        
    </div>
  );
}
