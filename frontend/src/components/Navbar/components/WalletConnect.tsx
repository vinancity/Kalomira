import { IonButton, IonLabel, IonIcon } from "@ionic/react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import useWalletModal from "hooks/useWalletModal";
import { link } from "ionicons/icons";

import useAuth from "hooks/useAuth";
import truncateAddress from "utils/truncateAddress";
import ConnectWalletButton from "components/ConnectWalletButton";

const ChainButton = styled(IonButton)`
  --border-radius: 100%;
  width: 35px;
  height: 35px;
  margin-right: 16px;
`;

export default function WalletConnect() {
  const { login, logout } = useAuth();
  const { account, active } = useWeb3React();
  const { onPresentAccountModal, onPresentChainModal } = useWalletModal(login, logout, account);

  return (
    <>
      <ChainButton className="ion-no-padding" color="primary" onClick={onPresentChainModal}>
        <IonIcon ios={link} md={link} />
      </ChainButton>
      {active ? (
        <>
          <IonButton strong fill="solid" color="primary" routerDirection="none" onClick={onPresentAccountModal}>
            <IonLabel>{`${account ? truncateAddress(account, 6) : ""}`}</IonLabel>
          </IonButton>
          <IonButton
            style={{ paddingRight: "7px" }}
            strong
            fill="outline"
            color="dark"
            routerDirection="none"
            onClick={logout}
          >
            <IonLabel id="foo">Disconnect</IonLabel>
          </IonButton>
        </>
      ) : (
        <ConnectWalletButton style={{ paddingRight: "7px" }} />
      )}
    </>
  );
}
