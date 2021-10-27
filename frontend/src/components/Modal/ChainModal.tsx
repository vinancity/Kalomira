import { IonModal, IonButton, IonRow, IonCol } from "@ionic/react";

const ChainItems: string[] = ["Ethereum", "KardiaChain", "Binance Smart Chain", "Other Chain"];

export default function ChainModal({ onDismiss = () => null }) {
  return (
    <IonModal cssClass="modal" isOpen={true} onDidDismiss={onDismiss}>
      {ChainItems.map((chainItem) => {
        return (
          <IonRow key={chainItem} className="ion-text-center ion-padding">
            <IonCol>
              <IonButton
                fill="outline"
                color="dark"
                strong
                onClick={() => {
                  onDismiss();
                }}
              >
                {`${chainItem}`}
              </IonButton>
            </IonCol>
          </IonRow>
        );
      })}
    </IonModal>
  );
}
