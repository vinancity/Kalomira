import React, { useState } from "react";
import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonIcon, IonButton } from "@ionic/react";

import { useWeb3React } from "@web3-react/core";
import { getFullDisplayBalance } from "utils/formatBalance";
import { chevronDown } from "ionicons/icons";
import StakeActions from "./Actions/StakeActions";

export default function FarmCard(props) {
  const { lpSymbol, multiplier, earnings, userData } = props;
  const [showExpand, setShowExpand] = useState(false);
  const { account } = useWeb3React();

  const toggleExpand = () => {
    setShowExpand(!showExpand);
  };

  return (
    <div>
      <IonCard>
        <IonCardHeader color="light">
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
                  <IonCol>{earnings.toFixed(4)}</IonCol>
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
        </IonCardHeader>

        <IonCardContent hidden={!showExpand}>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonRow>KALO EARNED</IonRow>
                <IonRow>{getFullDisplayBalance(earnings, undefined, 8)}</IonRow>
                <IonRow>
                  <IonButton disabled={!account}>Harvest</IonButton>
                </IonRow>
              </IonCol>
              <IonCol>
                {account ? (
                  <>
                    <IonRow>{`${lpSymbol} STAKED`}</IonRow>
                    <IonRow>{getFullDisplayBalance(userData.stakedBalance, undefined, 8)}</IonRow>
                  </>
                ) : (
                  <>
                    <IonRow>{"Connect wallet to farm"}</IonRow>
                  </>
                )}
                <IonRow>
                  <StakeActions {...props} />
                </IonRow>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </div>
  );
}
