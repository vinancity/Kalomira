import { IonModal, IonButton, IonRow, IonCol, IonGrid, IonLabel, IonItem } from "@ionic/react";
import { useWeb3React } from "@web3-react/core";

import truncateAddress from "utils/truncateAddress";
import styled from "styled-components";

import WalletTokenData from "../WalletTokenData";

export const Label = styled(IonLabel)`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--ion-color-primary);
  padding-left: 5px;
`;

export const Address = styled(IonLabel)`
  font-size: 1rem;
  font-weight: bold;
  margin-left: 4px;
`;

export const AddressWrapper = styled(IonItem)`
  --min-height: 50px;
  margin: 10px 0px 10px 0px;
  border-radius: 8px;
  --border-style: none;
  --background: var(--ion-color-light-tint);
`;

export default function WalletModal({ showModal, setShowModal, logout }) {
  const { account } = useWeb3React();

  return (
    <IonModal cssClass="modal-wallet" isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
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
          setShowModal(false);
        }}
      >
        Logout
      </IonButton>
    </IonModal>
  );
}
