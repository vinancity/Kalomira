import React, { useState, useEffect } from "react";
import { getBalanceAmount } from "utils/formatBalance";
import { BIG_ZERO } from "utils/bigNumber";
import { IonList, IonItem, IonItemDivider, IonInput, IonButton, IonGrid, IonRow, IonCol, IonLabel } from "@ionic/react";

import useGetRedeemAmount from "../hooks/useGetRedeemAmount";
import useGetRedeemRate from "../hooks/useGetRedeemRate";
import useRedeemKai from "../hooks/useRedeemKai";

export default function RedeemForm() {
  const [returnAmount, setReturnAmount] = useState("");
  const [redeemAmount, setRedeemAmount] = useState(BIG_ZERO);
  const [redeemRate, setRedeemRate] = useState(BIG_ZERO);
  const [pendingTx, setPendingTx] = useState(false);
  const { onGetRedeemAmount } = useGetRedeemAmount();
  const { onGetRedeemRate } = useGetRedeemRate();
  const { onRedeem } = useRedeemKai();

  const fetchMintInfo = async (value) => {
    if (value) {
      let redeemAmt = getBalanceAmount(await onGetRedeemAmount(value));
      let redeemRate = getBalanceAmount(await onGetRedeemRate(value), 27);
      setReturnAmount(value);
      setRedeemAmount(redeemAmt);
      setRedeemRate(redeemRate);
    } else {
      setReturnAmount("");
      setRedeemAmount(BIG_ZERO);
      setRedeemRate(BIG_ZERO);
    }
  };

  const handleRedeem = async () => {
    setPendingTx(true);
    try {
      console.log(`Returning ${returnAmount}`);
      await onRedeem(returnAmount);
    } catch (e) {
      console.error(e);
    } finally {
      setPendingTx(false);
    }
  };

  useEffect(() => {
    console.log(redeemAmount.toString());
  }, [redeemAmount]);

  return (
    <IonList>
      <IonItemDivider color="dark">
        <h2>
          Amount of <b>ibKAI</b> to return:
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
          Amount of <b>KAI</b> to be redeemed:
        </h2>
      </IonItemDivider>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonInput className="ion-padding" placeholder={redeemAmount.toString()} readonly />
            </IonCol>
            <IonCol className="ion-padding ion-text-right">ibKAI</IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
      <div className="ion-padding">
        <h2>Redeem rate: {redeemRate.toString()}</h2>
      </div>
      <IonButton expand="full" onClick={handleRedeem} color="dark" disabled={!redeemAmount.toNumber() || pendingTx}>
        Redeem
      </IonButton>
      <IonItemDivider />
    </IonList>
  );
}
