import React, { useState, useCallback } from "react";
import { IonButton, IonRow } from "@ionic/react";
import { useWeb3React } from "@web3-react/core";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/farms";
import { getBalanceAmount } from "utils/formatBalance";
import { BIG_ZERO } from "utils/bigNumber";
import BigNumber from "bignumber.js";

import useHarvestFarm from "views/Farms/hooks/useHarvestFarm";

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
    <div>
      <IonRow>KALO EARNED</IonRow>
      <IonRow>{earningsBN.toFixed(18)}</IonRow>
      <IonButton disabled={!account || earnings.eq(0) || pendingTx || !userDataReady} onClick={handleHarvest}>
        Harvest
      </IonButton>
    </div>
  );
}
