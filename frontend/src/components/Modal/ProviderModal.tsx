import { IonModal, IonButton, IonRow, IonCol } from "@ionic/react";
import { ProviderItems } from "config/constants/providers";

export default function ProviderModal({ login, onDismiss = () => null }) {
  return (
    <IonModal cssClass="modal" isOpen={true} onDidDismiss={onDismiss}>
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
    </IonModal>
  );
}
