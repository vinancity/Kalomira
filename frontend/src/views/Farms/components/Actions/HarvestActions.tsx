import React, { useState, useCallback } from "react";
import { IonButton } from "@ionic/react";
import { useWeb3React } from "@web3-react/core";
import { useAppDispatch } from "state";
import { useERC20 } from "hooks/useContract";
import { useFarmUser } from "state/farms/hooks";
import { getAddress } from "utils/addressHelpers";
import { fetchFarmUserDataAsync } from "state/farms";
import { getBalanceAmount, getFullDisplayBalance } from "utils/formatBalance";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "utils/bigNumber";

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

  console.log(earnings, displayBalance);

  const handleHarvest = async () => {
    setPendingTx(true);
    try {
      console.log("Harvesting: ", displayBalance);
      await onReward();
    } catch (e) {
      console.error(e);
    } finally {
      setPendingTx(false);
    }
  };

  return (
    <IonButton disabled={!account || earnings.eq(0) || pendingTx || !userDataReady} onClick={handleHarvest}>
      Harvest
    </IonButton>
  );
}
