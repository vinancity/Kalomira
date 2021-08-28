import React, { useState, useCallback } from "react";
import { IonButton } from "@ionic/react";
import { useWeb3React } from "@web3-react/core";
import { useAppDispatch } from "state";
import { useERC20 } from "hooks/useContract";
import { useFarmUser } from "state/farms/hooks";
import { getAddress } from "utils/addressHelpers";
import { fetchFarmUserDataAsync } from "state/farms";

import useApproveFarm from "views/Farms/hooks/useApproveFarm";
import useStakeFarms from "views/Farms/hooks/useStakeFarm";
import useUnstakeFarms from "views/Farms/hooks/useUnstakeFarm";

import DepositModal from "../DepositModal";

export default function StakeActions({ pid, multiplier, lpSymbol, lpAddresses, userDataReady }) {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid);

  const [requestedApproval, setRequestedApproval] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const isApproved = !!account && allowance && allowance.gt(0);
  const lpAddress = getAddress(lpAddresses);
  const lpContract = useERC20(lpAddress);
  const { onApprove } = useApproveFarm(lpContract);
  const { onStake } = useStakeFarms(pid);
  const { onUnstake } = useUnstakeFarms(pid);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      await onApprove();
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
      setRequestedApproval(false);
    } catch (error) {
      console.error(error);
    }
  }, [onApprove, dispatch, account, pid]);

  const handleStake = async (amount: string) => {
    await onStake(amount);
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
  };

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount);
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
  };

  return (
    <div>
      {isApproved ? (
        <div>
          <IonButton color="danger" disabled={!account}>
            Unstake
          </IonButton>
          <IonButton color="success" disabled={!account} onClick={() => setShowDepositModal(true)}>
            Stake
          </IonButton>
        </div>
      ) : (
        <IonButton disabled={!account || requestedApproval} onClick={handleApprove}>
          Approve
        </IonButton>
      )}
      <DepositModal
        max={tokenBalance}
        lpSymbol={lpSymbol}
        onConfirm={handleStake}
        showModal={showDepositModal}
        setShowModal={setShowDepositModal}
      />
    </div>
  );
}
