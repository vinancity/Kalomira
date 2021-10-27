import { IonButton, IonLabel, IonIcon } from "@ionic/react";
import { useWeb3React } from "@web3-react/core";
import useWalletModal from "hooks/useWalletModal";
import { link } from "ionicons/icons";

import useAuth from "hooks/useAuth";
import truncateAddress from "utils/truncateAddress";
import ConnectWalletButton from "components/ConnectWalletButton";

export default function WalletConnect() {
  const { login, logout } = useAuth();
  const { account, active } = useWeb3React();
  const { onPresentAccountModal, onPresentChainModal } = useWalletModal(login, logout, account);

  return (
    <>
      <IonButton className="circle-btn ion-no-padding ion-margin-end" color="primary" onClick={onPresentChainModal}>
        <IonIcon ios={link} md={link} className="" />
      </IonButton>
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
