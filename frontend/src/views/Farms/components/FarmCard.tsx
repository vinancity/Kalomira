import React, { useState } from "react";
import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent, IonIcon, IonButton } from "@ionic/react";
import { useWeb3React } from "@web3-react/core";
import { getFullDisplayBalance, getDecimalAmount } from "utils/formatBalance";
import { chevronDown } from "ionicons/icons";

import BigNumber from "bignumber.js";

import HarvestActions from "./Actions/HarvestActions";
import StakeActions from "./Actions/StakeActions";

export default function FarmCard(props) {
  const { lpSymbol, multiplier, earnings, userData } = props;
  const [showExpand, setShowExpand] = useState(false);
  const { account } = useWeb3React();

  const earningsBN = new BigNumber(earnings);

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
                  <IonCol>{earningsBN.toFixed(4)}</IonCol>
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
                <IonRow>{earningsBN.toFixed(18)}</IonRow>
                <IonRow>
                  <HarvestActions {...props} />
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
                    <IonRow>
                      <b>{"Connect wallet to farm"}</b>
                    </IonRow>
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
