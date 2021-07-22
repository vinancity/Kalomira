import React from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-12 text-center">
          {/* Metamask network should be set to Localhost:8545. */}
          {networkError && (
            <NetworkErrorMessage 
              message={networkError} 
              dismiss={dismiss} 
            />
          )}
        </div>
        <div className="col-6 p-4 text-center">
          <p>Please connect to your wallet.</p>
          {/*
          <button
            className="btn btn-warning"
            type="button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
          */}
          <Wallets connect={(wallet) => connectWallet(wallet)}/>
        </div>        
      </div>
    </div>
  );
}

export function Wallets({ connect }) {  

    function check(wallet){
        if(wallet === "metamask"){
          if(window.ethereum){ return connect(window.ethereum); }
          else { console.error("No metamask wallet found."); }
        }
        if(wallet === "kardiachain"){
          if(window.kardiachain){ return connect(window.kardiachain); }
          else { console.error("No kardiachain wallet found."); }
        }
    }

    return (
      <>
        <button type="button" className="btn btn-warning" data-toggle="modal" data-target="#exampleModal">
        Connect to a wallet
        </button>
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel"><b>Connect to a Wallet</b></h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div className="modal-body">
                <div className="p-2">
                  <button className="btn btn-warning" type="button" data-dismiss="modal" onClick={() => check("metamask")}>
                    Metamask
                  </button>
                </div>
                <div className="p-2">
                  <button className="btn btn-warning" type="button" data-dismiss="modal" onClick={() => check("kardiachain")}>
                    KardiaChain
                  </button>
                </div>
            </div>
            {/*
            <div className="modal-footer">

            </div>*/}
            </div>
        </div>
        </div>
      </>
    );
  
}
