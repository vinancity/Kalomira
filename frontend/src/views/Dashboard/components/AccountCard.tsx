import styled from "styled-components";
import { IonGrid, IonRow, IonCol, IonAvatar, IonLabel, IonCardHeader, IonCardContent, IonButton } from "@ionic/react";
import { Address, AddressWrapper } from "components/Navbar/components/modal/WalletModal";
import { DashboardCard, CardTitle } from "../Dashboard";
import { TokenItem } from "components/Navbar/components/WalletTokenData";

import { formatAddress } from "utils/truncateAddress";
import { getFullDisplayBalance } from "utils/formatBalance";
import { useNativeBalance, useTokenBalance, useKLSBalance } from "hooks/useTokenBalance";
import { getKaloAddress, getIbKAIAddress } from "utils/addressHelpers";

export const TextLabel = styled(IonLabel)`
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--ion-color-dark);
`;

export default function AccountCard({ account }) {
  return (
    <DashboardCard>
      <IonCardHeader color="light">
        <CardTitle>Your Account</CardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-no-padding ion-padding-horizontal">
        <AccountData account={account} />
        <IonGrid>
          <IonRow className="ion-margin-top ion-align-items-center">
            <IonCol size="auto" className="ion-margin-end">
              <IonLabel>View your staking pools:</IonLabel>
            </IonCol>
            <IonCol>
              <IonButton expand="block">View</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </DashboardCard>
  );
}

function AccountData({ account }) {
  const { balance: nativeBalance } = useNativeBalance();
  const { balance: kaloBalance } = useTokenBalance(getKaloAddress());
  const { balance: ibkaiBalance } = useTokenBalance(getIbKAIAddress());
  const { klsBalance } = useKLSBalance();

  return (
    <IonGrid className="ion-margin-top">
      <IonRow>
        <IonCol>
          <TextLabel>Address</TextLabel>
          <AddressWrapper>
            <Address className="ion-no-margin">{account ? `${formatAddress(account)}` : ``}</Address>
          </AddressWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <TokenItem>
            <IonAvatar>
              <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
            </IonAvatar>
            <IonCol className="ion-padding-start">Balance</IonCol>
            <IonCol className="ion-text-right">
              {account ? getFullDisplayBalance(nativeBalance, undefined, 4) : ""}
            </IonCol>
          </TokenItem>
          <TokenItem>
            <IonAvatar>
              <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
            </IonAvatar>
            <IonCol className="ion-padding-start">KALO</IonCol>
            <IonCol className="ion-text-right">
              {account ? getFullDisplayBalance(kaloBalance, undefined, 4) : ""}
            </IonCol>
          </TokenItem>
          <TokenItem>
            <IonAvatar>
              <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
            </IonAvatar>
            <IonCol className="ion-padding-start">KLS (?)</IonCol>
            <IonCol className="ion-text-right">{account ? getFullDisplayBalance(klsBalance, undefined, 4) : ""}</IonCol>
          </TokenItem>
          <TokenItem>
            <IonAvatar>
              <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
            </IonAvatar>
            <IonCol className="ion-padding-start">ibKAI</IonCol>
            <IonCol className="ion-text-right">
              {account ? getFullDisplayBalance(ibkaiBalance, undefined, 4) : ""}
            </IonCol>
          </TokenItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
