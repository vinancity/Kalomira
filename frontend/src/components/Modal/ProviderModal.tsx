import { IonModal, IonButton, IonRow, IonCol } from "@ionic/react";
import styled from "styled-components";
import { ProviderItems } from "config/constants/providers";

const Modal = styled(IonModal)`
  --height: 400px;
  --width: 400px;
  --border-radius: 25px;

  .ion-page {
    justify-content: center;
  }
`;

export default function ProviderModal({ login, onDismiss = () => null }) {
  return (
    <Modal isOpen={true} onDidDismiss={onDismiss}>
      {ProviderItems.map((providerItem) => {
        return (
          <IonRow key={providerItem.name} className="ion-text-center ion-padding">
            <IonCol>
              <IonButton
                onClick={() => {
                  login(providerItem.connector);
                  onDismiss();
                }}
              >
                {`${providerItem.name}`}
              </IonButton>
            </IonCol>
          </IonRow>
        );
      })}
    </Modal>
  );
}
