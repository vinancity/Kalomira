import React from "react";

export function WithdrawYield({ withdrawYield, tokenSymbol }) {
  return (
    <div>
      <h4>Withdraw Yield</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();
          withdrawYield();          
        }}
      >
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Withdraw" />
        </div>

      </form>        
    </div>
  );
}
