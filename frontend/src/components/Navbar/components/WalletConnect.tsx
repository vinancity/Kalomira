import React, { useState, useEffect } from "react";
import { IonButton, IonLabel } from "@ionic/react";
import { useWeb3React } from "@web3-react/core";
import { ConnectorNames } from "utils/walletTypes";
import { setConnector, clearConnector } from "state/connector";
import { useDispatch } from "react-redux";
import { useNativeBalance, useIbKaiBalance } from "hooks/useTokenBalance";
import { getFullDisplayBalance } from "utils/formatBalance";

import useAuth from "hooks/useAuth";
import truncateAddress from "utils/truncateAddress";
import ConnectWalletButton from "components/ConnectWalletButton";
import WalletModal from "./WalletModal";

export default function WalletConnect() {
  const { login, logout } = useAuth();
  const { account, active } = useWeb3React();
  const { balance } = useNativeBalance();
  const { ibKaiBalance } = useIbKaiBalance();
  const [addr, setAddress] = useState(account);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (account) {
      setAddress(account);
    }
  }, [account]);

  const _login = (connector: ConnectorNames) => {
    login(connector);
    dispatch(setConnector(connector));
  };

  const _logout = () => {
    logout();
    dispatch(clearConnector());
  };

  return (
    <>
      {active ? (
        <>
          <IonButton
            color="dark"
            strong
            fill="clear"
            routerDirection="none"
            onClick={() => {
              navigator.clipboard.writeText(getFullDisplayBalance(balance, undefined, 18));
            }}
          >
            <IonLabel>{`KAI: ${getFullDisplayBalance(balance, undefined, 4)}`}</IonLabel>
          </IonButton>
          <IonButton
            color="dark"
            strong
            fill="clear"
            routerDirection="none"
            onClick={() => {
              navigator.clipboard.writeText(getFullDisplayBalance(ibKaiBalance, undefined, 18));
            }}
          >
            <IonLabel>{`ibKAI: ${getFullDisplayBalance(ibKaiBalance, undefined, 4)}`}</IonLabel>
          </IonButton>
          <IonButton
            color="success"
            strong
            fill="clear"
            routerDirection="none"
            onClick={() => {
              navigator.clipboard.writeText(addr);
            }}
          >
            <IonLabel>{`${addr ? truncateAddress(addr, 6) : ""}`}</IonLabel>
          </IonButton>
          <IonButton color="dark" strong fill="outline" routerDirection="none" onClick={_logout}>
            <IonLabel id="foo">Disconnect</IonLabel>
          </IonButton>
        </>
      ) : (
        <ConnectWalletButton setShowModal={setShowModal} />
      )}

      <WalletModal showModal={showModal} setShowModal={setShowModal} login={_login} />
    </>
  );
}
