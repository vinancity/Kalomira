import { useState, useEffect } from "react";
import { IonButton, IonLabel, IonIcon } from "@ionic/react";
import { useWeb3React } from "@web3-react/core";
import { ConnectorNames } from "utils/walletTypes";
import { setConnector, clearConnector } from "state/connector";
import { useDispatch } from "react-redux";
import { link } from "ionicons/icons";

import useAuth from "hooks/useAuth";
import truncateAddress from "utils/truncateAddress";
import ConnectWalletButton from "components/ConnectWalletButton";
import ChainModal from "./modal/ChainModal";
import ProviderModal from "./modal/ProviderModal";
import WalletModal from "./modal/WalletModal";

export default function WalletConnect() {
  const { login, logout } = useAuth();
  const { account, active } = useWeb3React();
  const [addr, setAddress] = useState(account);
  const [showChains, setShowChains] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
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
      <IonButton
        className="circle-btn ion-no-padding ion-margin-end"
        onClick={() => {
          setShowChains(true);
        }}
      >
        <IonIcon ios={link} md={link} className="" />
      </IonButton>
      {active ? (
        <>
          <IonButton
            strong
            fill="solid"
            routerDirection="none"
            onClick={() => {
              setShowWallet(true);
            }}
          >
            <IonLabel>{`${addr ? truncateAddress(addr, 6) : ""}`}</IonLabel>
          </IonButton>
          <IonButton strong fill="outline" routerDirection="none" onClick={_logout}>
            <IonLabel id="foo">Disconnect</IonLabel>
          </IonButton>
        </>
      ) : (
        <ConnectWalletButton setShowModal={setShowProviders} />
      )}
      <ChainModal showModal={showChains} setShowModal={setShowChains} />
      <WalletModal showModal={showWallet} setShowModal={setShowWallet} logout={logout} />
      <ProviderModal showModal={showProviders} setShowModal={setShowProviders} login={_login} />
    </>
  );
}
