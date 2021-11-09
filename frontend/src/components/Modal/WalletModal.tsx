import {
  IonModal,
  IonButton,
  IonRow,
  IonCol,
  IonGrid,
  IonLabel,
  IonItem,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import styled from "styled-components";
import truncateAddress from "utils/truncateAddress";

import WalletTokenData from "../Navbar/components/WalletTokenData";

const Modal = styled(IonModal)`
  --height: 450px;
  --width: 400px;
  --border-radius: 25px;
  .ion-page {
    padding: 0px 15px 5px !important;
  }
`;

const Header = styled(IonCardHeader)`
  margin: 0px -15px;
`;

const CardTitle = styled(IonCardTitle)`
  font-weight: bold;
  font-size: 1.5rem;
  padding: 0px 13px;
`;

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
  margin: 10px 0px;
  border-radius: 8px;
  --border-style: none;
  --background: var(--ion-color-light-tint);
`;

const Logout = styled(IonButton)`
  align-self: center;
  width: 50%;
  margin-bottom: 15px;
`;

export default function WalletModal({ account, logout, onDismiss = () => null }) {
  return (
    <Modal isOpen={true} onDidDismiss={onDismiss}>
      <Header color="light">
        <CardTitle>Your Wallet</CardTitle>
      </Header>
      <IonGrid className="ion-no-margin ion-padding-top">
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

      <Logout
        expand="block"
        onClick={() => {
          logout();
          onDismiss();
        }}
      >
        Logout
      </Logout>
    </Modal>
  );
}
