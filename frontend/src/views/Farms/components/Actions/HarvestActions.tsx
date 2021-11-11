import { useState } from "react";
import styled from "styled-components";
import { IonButton, IonRow, IonCol, IonLabel } from "@ionic/react";
import { useWeb3React } from "@web3-react/core";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/farms";
import { getBalanceAmount } from "utils/formatBalance";
import { BIG_ZERO } from "utils/bigNumber";
import BigNumber from "bignumber.js";

import useHarvestFarm from "views/Farms/hooks/useHarvestFarm";

const FlexColumn = styled(IonCol)`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const Label = styled(IonLabel)`
  font-weight: bold;
`;

const AmountLabel = styled(IonLabel)`
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.5rem;
`;

const SubLabel = styled(IonLabel)`
  font-size: 1rem;
  color: var(--ion-color-medium-tint);
`;

export default function HarvestActions({ pid, userData, userDataReady }) {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { onReward } = useHarvestFarm(pid);

  const [pendingTx, setPendingTx] = useState(false);

  const earningsBN = new BigNumber(userData.earnings);

  let earnings = BIG_ZERO;
  let displayBalance = userDataReady ? earnings.toString() : BIG_ZERO;

  if (!earningsBN.isZero()) {
    earnings = getBalanceAmount(earningsBN);
    displayBalance = earnings.toFixed(18, BigNumber.ROUND_DOWN);
  }

  const handleHarvest = async () => {
    setPendingTx(true);
    try {
      console.log("Harvesting: ", displayBalance);
      await onReward();
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
    } catch (e) {
      console.error(e);
    } finally {
      setPendingTx(false);
    }
  };

  return (
    <IonRow style={{ height: "100%" }}>
      <IonCol className="ion-no-padding">
        <IonRow className="ion-margin-bottom">
          <Label>KALO EARNED</Label>
        </IonRow>
        <IonRow>
          <AmountLabel>{account ? earnings.toFixed(6) : "0.000000"}</AmountLabel>
        </IonRow>
        <IonRow>
          <SubLabel>{account ? `$0.00` : `$0.00`}</SubLabel>
        </IonRow>
      </IonCol>
      <FlexColumn className="ion-no-padding">
        <IonButton disabled={!account || earnings.eq(0) || pendingTx || !userDataReady} onClick={handleHarvest}>
          Harvest
        </IonButton>
      </FlexColumn>
    </IonRow>
  );
}
