import React, { useState, useMemo, useCallback } from "react";
import { IonModal, IonButton, IonRow, IonCol, IonInput, IonGrid } from "@ionic/react";
import { getFullDisplayBalance } from "utils/formatBalance";

import BigNumber from "bignumber.js";

export default function DepositModal({ max, lpSymbol, onConfirm, showModal, setShowModal }) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [pendingTx, setPendingTx] = useState(false);

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max);
  }, [max]);

  const lpTokensToStake = new BigNumber(stakeAmount);
  const fullBalanceNumber = new BigNumber(fullBalance);

  const handleChange = useCallback(
    (e) => {
      if (e.currentTarget.validity.valid) {
        setStakeAmount(e.currentTarget.value.replace(/,/g, "."));
      }
    },
    [setStakeAmount]
  );

  const handleSelectMax = useCallback(() => {
    setStakeAmount(fullBalance);
  }, [fullBalance, setStakeAmount]);

  const handleConfirm = async () => {
    setPendingTx(true);
    try {
      console.log("Staking: ", stakeAmount);
      await onConfirm(stakeAmount);
      setShowModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setPendingTx(false);
    }
  };

  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
      <IonGrid>
        <IonRow>
          <IonCol size="10">{`Balance: ${fullBalance} ${lpSymbol}`}</IonCol>
          <IonCol>
            <IonButton fill="outline" size="small" onClick={handleSelectMax}>
              Max
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          {/* TODO: Separate input into component */}
          <input
            className="ion-padding"
            pattern={`^[0-9]*[.,]?[0-9]{0,${18}}$`}
            inputMode="decimal"
            step="any"
            min="0"
            placeholder="0"
            onChange={handleChange}
            value={stakeAmount}
          ></input>

          <IonButton
            onClick={handleConfirm}
            disabled={
              pendingTx || !lpTokensToStake.isFinite() || lpTokensToStake.eq(0) || lpTokensToStake.gt(fullBalanceNumber)
            }
          >
            Confirm
          </IonButton>
        </IonRow>
      </IonGrid>
    </IonModal>
  );
}
