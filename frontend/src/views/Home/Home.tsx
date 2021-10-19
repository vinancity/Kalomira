import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { IonContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from "@ionic/react";
import { useNativeBalance, useIbKaiBalance, useTokenBalance } from "hooks/useTokenBalance";
import { getFullDisplayBalance } from "utils/formatBalance";
import { getKaloAddress, getIbKAIAddress } from "utils/addressHelpers";
import { useTreasury } from "hooks/useContract";

export default function Home() {
  const { account } = useWeb3React();
  const { balance } = useNativeBalance();
  // const { ibKaiBalance } = useIbKaiBalance();
  const ibKaiBalance = useTokenBalance(getIbKAIAddress()).balance;
  const kaloBalance = useTokenBalance(getKaloAddress()).balance;

  return (
    <IonContent className="padded-content">
      <IonCard>
        <IonCardHeader color="light">
          <IonCardTitle>Home</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {account ? (
            <>
              <h1>Address: {account?.toUpperCase()}</h1>
              <h2>{`KAI: ${getFullDisplayBalance(balance, undefined, 8)}`}</h2>
              <h2>{`ibKAI: ${getFullDisplayBalance(ibKaiBalance, undefined, 8)}`}</h2>
              <h2>{`KALO: ${getFullDisplayBalance(kaloBalance, undefined, 18)}`}</h2>
            </>
          ) : (
            <>
              <h1>Address:</h1>
              <h2>{`KAI: -`}</h2>
              <h2>{`ibKAI: -`}</h2>
              <h2>{`KALO: -`}</h2>
            </>
          )}
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
}
