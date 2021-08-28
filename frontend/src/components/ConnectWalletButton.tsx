import React from "react";
import { IonButton, IonLabel } from "@ionic/react";

export default function ConnectWalletButton({ setShowModal }) {
  return (
    <>
      <IonButton color="dark" strong fill="outline" routerDirection="none" onClick={() => setShowModal(true)}>
        <IonLabel id="foo">Connect</IonLabel>
      </IonButton>
    </>
  );
}
