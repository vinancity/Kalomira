import React, { useState, useMemo, useCallback } from "react";
import { IonModal, IonButton, IonRow, IonCol, IonInput, IonGrid } from "@ionic/react";
import { getFullDisplayBalance } from "utils/formatBalance";

import BigNumber from "bignumber.js";

export default function WithdrawModal({ max, lpSymbol, onConfirm, showModal, setShowModal }) {
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [pendingTx, setPendingTx] = useState(false);

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max);
  }, [max]);

  const lpTokensToUntake = new BigNumber(unstakeAmount);
  const fullBalanceNumber = new BigNumber(fullBalance);

  const handleChange = useCallback(
    (e) => {
      if (e.currentTarget.validity.valid) {
        setUnstakeAmount(e.currentTarget.value.replace(/,/g, "."));
      }
    },
    [setUnstakeAmount]
  );

  const handleSelectMax = useCallback(() => {
    setUnstakeAmount(fullBalance);
  }, [fullBalance, setUnstakeAmount]);

  const handleConfirm = async () => {
    setPendingTx(true);
    try {
      console.log("Unstaking: ", unstakeAmount);
      await onConfirm(unstakeAmount);
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
          <IonCol>{`Balance: ${fullBalance} ${lpSymbol}`}</IonCol>
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
            value={unstakeAmount}
          ></input>

          <IonButton
            onClick={handleConfirm}
            disabled={
              pendingTx ||
              !lpTokensToUntake.isFinite() ||
              lpTokensToUntake.eq(0) ||
              lpTokensToUntake.gt(fullBalanceNumber)
            }
          >
            Confirm
          </IonButton>
        </IonRow>
      </IonGrid>
    </IonModal>
  );
}
