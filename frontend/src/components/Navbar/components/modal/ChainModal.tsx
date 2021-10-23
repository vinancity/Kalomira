import { IonModal, IonButton, IonRow, IonCol } from "@ionic/react";

export default function ChainModal({ showModal, setShowModal }) {
  return (
    <IonModal cssClass="modal" isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
      <IonRow className="ion-text-center ion-padding">
        <IonCol>
          <IonButton
            fill="outline"
            strong
            onClick={() => {
              setShowModal(false);
            }}
          >
            Ethereum
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton
            fill="outline"
            strong
            onClick={() => {
              setShowModal(false);
            }}
          >
            KardiaChain
          </IonButton>
        </IonCol>
      </IonRow>
    </IonModal>
  );
}
