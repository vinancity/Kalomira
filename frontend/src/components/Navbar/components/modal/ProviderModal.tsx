import { IonModal, IonButton, IonRow, IonCol } from "@ionic/react";
import { ConnectorNames } from "utils/walletTypes";

export default function ProviderModal({ showModal, setShowModal, login }) {
  return (
    <IonModal cssClass="modal" isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
      <IonRow className="ion-text-center ion-padding">
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
