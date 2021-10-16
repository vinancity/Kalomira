import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  IonButtons,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonButton,
} from "@ionic/react";
import MintForm from "./components/MintForm";
import RedeemForm from "./components/RedeemForm";

export default function Home() {
  const [mintActive, setMintActive] = useState(true);

  return (
    <IonContent className="padded-content">
      <IonCard>
        <IonCardHeader color="light">
          <IonCardTitle>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton expand="block" color="dark" onClick={() => setMintActive(true)}>
                    <b>Mint</b>
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton expand="block" color="dark" onClick={() => setMintActive(false)}>
                    <b>Redeem</b>
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div hidden={!mintActive}>
            <MintForm />
          </div>
          <div hidden={mintActive}>
            <RedeemForm />
          </div>
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
}
