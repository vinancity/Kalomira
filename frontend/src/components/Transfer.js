import React from "react";

export function Transfer({ transferTokens, tokenSymbol }) {

  return (
    <div>
      <h4>Transfer</h4>    
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const to = formData.get("to");
          const amount = formData.get("amount");

          if (to && amount) {
            transferTokens(to, amount, tokenSymbol);
          }
        }}
      >
        <div className="form-group">
          {tokenSymbol === "KAL" && (<KAL />)}
          {tokenSymbol === "KAI" && (<KAI />)}
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
          <label>Recipient address</label>
          <input className="form-control" type="text" name="to" required />
        </div>
        <div className="form-group">
          <input className="btn btn-warning" type="submit" value={`Transfer ${tokenSymbol}`} />
        </div>
      </form>
    </div>
  );
}

class KAI extends React.Component {
  render(){
    return <label>Amount of <b>KAI</b> to Transfer</label>
  }
}

class KAL extends React.Component {
  render(){
    return <label>Amount of <b>KAL</b> to Transfer</label>
  }
}