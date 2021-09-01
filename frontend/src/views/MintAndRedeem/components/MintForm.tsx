import React, { useState, useEffect } from "react";
import { getBalanceAmount } from "utils/formatBalance";
import { BIG_ZERO } from "utils/bigNumber";
import { IonList, IonItem, IonItemDivider, IonInput, IonButton, IonGrid, IonRow, IonCol, IonLabel } from "@ionic/react";

import useGetMintAmount from "../hooks/useGetMintAmount";
import useGetMintRate from "../hooks/useGetMintRate";
import useMintIbKai from "../hooks/useMintIbKai";

export default function MintForm() {
  const [depositAmount, setDepositAmount] = useState("");
  const [mintAmount, setMintAmount] = useState(BIG_ZERO);
  const [mintRate, setMintRate] = useState(BIG_ZERO);
  const [pendingTx, setPendingTx] = useState(false);
  const { onGetMintAmount } = useGetMintAmount();
  const { onGetMintRate } = useGetMintRate();
  const { onMint } = useMintIbKai();

  const fetchMintInfo = async (value) => {
    if (value) {
      let mintAmt = getBalanceAmount(await onGetMintAmount(value));
      let mintRate = getBalanceAmount(await onGetMintRate(value), 27);
      setDepositAmount(value);
      setMintAmount(mintAmt);
      setMintRate(mintRate);
    } else {
      setDepositAmount("");
      setMintAmount(BIG_ZERO);
      setMintRate(BIG_ZERO);
    }
  };

  const handleMint = async () => {
    setPendingTx(true);
    try {
      console.log(`Depositing ${depositAmount}`);
      await onMint(depositAmount);
    } catch (e) {
      console.error(e);
    } finally {
      setPendingTx(false);
    }
  };

  useEffect(() => {
    console.log(mintAmount.toString());
  }, [mintAmount]);

  return (
    <IonList>
      <IonItemDivider color="dark">
        <h2>
          Amount of <b>KAI</b> to deposit:
        </h2>
      </IonItemDivider>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonInput
                className="ion-padding"
                placeholder="0"
                min="0"
                inputmode="decimal"
                clearInput
                onIonChange={(e) => fetchMintInfo(e.detail.value)}
                onKeyPress={(e) => {
                  let regex = /^[0-9]*[.]?[0-9]*$/;
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                required
              />
            </IonCol>
            <IonCol className="ion-padding ion-text-right">KAI</IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
      <IonItemDivider color="dark">
        <h2>
          Amount of <b>ibKAI</b> to be minted:
        </h2>
      </IonItemDivider>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonInput className="ion-padding" placeholder={mintAmount.toString()} readonly />
            </IonCol>
            <IonCol className="ion-padding ion-text-right">ibKAI</IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
      <div className="ion-padding">
        <h2>Mint rate: {mintRate.toString()}</h2>
      </div>
      <IonButton expand="full" onClick={handleMint} color="dark" disabled={!mintAmount.toNumber() || pendingTx}>
        Mint
      </IonButton>
      <IonItemDivider />
    </IonList>
  );
}
