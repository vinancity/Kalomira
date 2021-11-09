import { useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import { IonModal, IonButton, IonRow, IonCol, IonGrid, IonCardHeader, IonCardTitle } from "@ionic/react";
import { Input } from "components/Input/Input";
import { getFullDisplayBalance } from "utils/formatBalance";

import BigNumber from "bignumber.js";

const Modal = styled(IonModal)`
  --height: 400px;
  --width: 600px;
  --border-radius: 15px;
`;

const CardTitle = styled(IonCardTitle)`
  font-weight: bold;
  font-size: 1.5rem;
  margin: 10px;
`;

export default function DepositModal({ max, lpSymbol, onConfirm, onDismiss = () => null }) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [pendingTx, setPendingTx] = useState(false);

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, undefined, 4);
  }, [max]);

  const lpTokensToStake = new BigNumber(stakeAmount);
  const fullBalanceNumber = new BigNumber(fullBalance);

  const onUserInput = useCallback(
    (nextInput: string) => {
      setStakeAmount(nextInput);
    },
    [setStakeAmount]
  );

  const handleMax = useCallback(() => {
    setStakeAmount(fullBalance);
  }, [fullBalance, setStakeAmount]);

  const handleConfirm = async () => {
    setPendingTx(true);
    try {
      console.log("Staking: ", stakeAmount);
      await onConfirm(stakeAmount);
      onDismiss();
    } catch (e) {
      console.error(e);
    } finally {
      setPendingTx(false);
    }
  };

  return (
    <Modal isOpen={true} onDidDismiss={onDismiss}>
      <IonCardHeader color="light">
        <CardTitle>Stake LP tokens</CardTitle>
      </IonCardHeader>
      <IonGrid className="ion-margin">
        <IonRow>
          <IonCol className="ion-no-padding">
            <IonRow className="ion-padding-bottom ion-margin-top">
              <Input
                value={stakeAmount}
                label1="Stake"
                label2={`Balance: ${fullBalance}`}
                tokenLabel={lpSymbol}
                onUserInput={onUserInput}
                withMax={true}
                onMax={handleMax}
              />
            </IonRow>
            <IonRow className="ion-padding-top">
              <IonCol className="ion-no-padding">
                <IonButton fill="outline" expand="block" onClick={onDismiss}>
                  Cancel
                </IonButton>
              </IonCol>
              <IonCol className="ion-no-padding">
                <IonButton
                  onClick={handleConfirm}
                  expand="block"
                  disabled={
                    pendingTx ||
                    !lpTokensToStake.isFinite() ||
                    lpTokensToStake.eq(0) ||
                    lpTokensToStake.gt(fullBalanceNumber)
                  }
                >
                  Confirm
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow>
      </IonGrid>
    </Modal>
  );
}
