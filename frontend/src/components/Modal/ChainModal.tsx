import { IonModal, IonButton, IonRow, IonCol } from "@ionic/react";
import styled from "styled-components";

const ChainItems: string[] = ["Ethereum", "KardiaChain", "Binance Smart Chain", "Other Chain"];

const Modal = styled(IonModal)`
  --height: 400px;
  --width: 400px;
  --border-radius: 25px;

  .ion-page {
    justify-content: center;
  }
`;

export default function ChainModal({ onDismiss = () => null }) {
  return (
    <Modal isOpen={true} onDidDismiss={onDismiss}>
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
    </Modal>
  );
}
