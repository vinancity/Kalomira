import { IonButton, IonLabel } from "@ionic/react";
import useAuth from "hooks/useAuth";
import useWalletModal from "hooks/useWalletModal";

export default function ConnectWalletButton(props) {
  const { login, logout } = useAuth();
  const { onPresentConnectModal } = useWalletModal(login, logout);
  return (
    <IonButton color="dark" strong fill="outline" routerDirection="none" onClick={onPresentConnectModal} {...props}>
      <IonLabel id="foo">Connect</IonLabel>
    </IonButton>
  );
}
