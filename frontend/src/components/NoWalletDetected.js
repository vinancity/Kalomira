import React from "react";

export function NoWalletDetected() {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-6 p-4 text-center">
          <p>
            No Ethereum wallet was detected. <br />
            Please install a valid Ethereum wallet.<br />
            <br />
            <a
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Metamask Wallet
            </a>
            <br />
            <a
              href="https://chrome.google.com/webstore/detail/kardiachain-wallet/pdadjkfkgcafgbceimcpbkalnfnepbnk"
              target="_blank"
              rel="noopener noreferrer"
            >
              KardiaChain Wallet
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
