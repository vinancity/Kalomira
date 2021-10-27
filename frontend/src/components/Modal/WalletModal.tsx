import { IonModal, IonButton, IonRow, IonCol, IonGrid, IonLabel, IonItem } from "@ionic/react";

import truncateAddress from "utils/truncateAddress";
import styled from "styled-components";

import WalletTokenData from "../Navbar/components/WalletTokenData";

export const Label = styled(IonLabel)`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--ion-color-primary);
  padding-left: 5px;
`;

export const Address = styled(IonLabel)`
  font-size: 1rem;
  font-weight: bold;
`;

export const AddressWrapper = styled(IonItem)`
  --min-height: 40px;
  margin: 10px 0px 10px 0px;
  border-radius: 8px;
  --border-style: none;
  --background: var(--ion-color-light-tint);
`;

export default function WalletModal({ account, logout, onDismiss = () => null }) {
  return (
    <IonModal cssClass="modal-wallet" isOpen={true} onDidDismiss={onDismiss}>
      <IonGrid className="ion-no-margin">
        <IonRow>
          <IonCol>
            <Label>Address</Label>
            <AddressWrapper
              button
              onClick={() => {
                navigator.clipboard.writeText(account);
              }}
            >
              <Address>{account ? `${truncateAddress(account, 32)}` : ""}</Address>
            </AddressWrapper>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <WalletTokenData />
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonButton
        expand="block"
        className="ion-margin logout-btn"
        onClick={() => {
          logout();
          onDismiss();
        }}
      >
        Logout
      </IonButton>
    </IonModal>
  );
}
