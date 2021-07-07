import React from "react";

export function Exchange({ transferTokens, tokenSymbol }) {
  return (
    <div>
      <h4>Exchange</h4>
      <SubExchange />
        <div className="form-group">
          <label>Amount of {tokenSymbol}</label>
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
          <input className="btn btn-info" type="submit" value="Exchange" />
        </div>

    </div>
  );
}

class SubExchange extends React.Component {
    render(){
        return <h2>THIS IS A TEST</h2>;
    }
}