import React from "react";
import { IonModal, IonButton, IonRow, IonCol } from "@ionic/react";
import { ConnectorNames } from "utils/walletTypes";

export default function WalletModal({ showModal, setShowModal, login }) {
  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
      <IonRow className="ion-text-center">
        <IonCol>
          <IonButton
            onClick={() => {
              login(ConnectorNames.Injected);
              setShowModal(false);
            }}
          >
            Metamask
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton
            onClick={() => {
              login(ConnectorNames.KAI);
              setShowModal(false);
            }}
          >
            KAI Wallet
          </IonButton>
        </IonCol>
      </IonRow>
    </IonModal>
  );
}
