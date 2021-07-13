import React from "react";

export function Stake({ stakeTokens, tokenSymbol }) {
  return (
    <div>
      <h4>Stake KAI</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");

          if (amount) {
            stakeTokens(amount);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of {tokenSymbol} to Stake</label>
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
          <input className="btn btn-success" type="submit" value="Stake" />
        </div>

      </form>        
    </div>
  );
}
