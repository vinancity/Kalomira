import { IonCol, IonAvatar, IonItem, IonImg } from "@ionic/react";
import { useNativeBalance, useTokenBalance, useKLSBalance } from "hooks/useTokenBalance";
import { getKaloAddress } from "utils/addressHelpers";
import { getFullDisplayBalance } from "utils/formatBalance";
import styled from "styled-components";

export const TokenItem = styled(IonItem)`
  --min-height: 60px;
  margin: 5px 0px 5px 0px;
  border-radius: 8px;
  --background: var(--ion-color-light-tint);
  --border-style: none;
`;

export default function WalletTokenData() {
  const { balance } = useNativeBalance();
  const { balance: kaloBalance } = useTokenBalance(getKaloAddress());
  const { klsBalance } = useKLSBalance();

  return (
    <>
      <TokenItem>
        <IonAvatar>
          <IonImg src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
        </IonAvatar>
        <IonCol className="ion-padding-start">Balance</IonCol>
        <IonCol className="ion-text-right">{getFullDisplayBalance(balance, undefined, 4)}</IonCol>
      </TokenItem>
      <TokenItem>
        <IonAvatar>
          <IonImg src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
        </IonAvatar>
        <IonCol className="ion-padding-start">KALO</IonCol>
        <IonCol className="ion-text-right">{getFullDisplayBalance(kaloBalance, undefined, 4)}</IonCol>
      </TokenItem>
      <TokenItem>
        <IonAvatar>
          <IonImg src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
        </IonAvatar>
        <IonCol className="ion-padding-start">KLS</IonCol>
        <IonCol className="ion-text-right">{getFullDisplayBalance(klsBalance, undefined, 4)}</IonCol>
      </TokenItem>
    </>
  );
}
