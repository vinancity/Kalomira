import React from "react";

export function Withdraw({ withdrawTokens, tokenSymbol }) {
  return (
    <div>
      <h4>Withdraw</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");

          if (amount) {
            withdrawTokens(amount);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of {tokenSymbol} to Withdraw</label>
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
          <input className="btn btn-primary" type="submit" value="Withdraw" />
        </div>

      </form>        
    </div>
  );
}
