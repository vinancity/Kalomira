import React from "react";
import { IonGrid, IonRow, IonCol, IonIcon, IonButton } from "@ionic/react";
import { getFullDisplayBalance } from "utils/formatBalance";
import { chevronDown } from "ionicons/icons";

import BigNumber from "bignumber.js";

export default function CardHeader(props) {
  const { lpSymbol, multiplier, earnings, userData, toggleExpand } = props;
  const earningsBN = new BigNumber(earnings);

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonRow>
            <IonCol>Farm</IonCol>
            <IonCol>Earned</IonCol>
            <IonCol>Multiplier</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>{lpSymbol}</IonCol>
            <IonCol>{getFullDisplayBalance(earningsBN, undefined, 4)}</IonCol>
            <IonCol>{multiplier}</IonCol>
          </IonRow>
        </IonCol>
        <IonCol size="1">
          <IonButton className="ion-text-center" fill="clear" color="dark" onClick={() => toggleExpand()}>
            <IonIcon slot="start" md={chevronDown}></IonIcon>
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
