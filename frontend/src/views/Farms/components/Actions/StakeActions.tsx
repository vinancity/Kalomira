import { useState, useCallback } from "react";
import styled from "styled-components";
import { IonButton, IonRow, IonCol, IonLabel, IonIcon } from "@ionic/react";
import { add, remove } from "ionicons/icons";
import { useWeb3React } from "@web3-react/core";
import { useAppDispatch } from "state";
import { useERC20 } from "hooks/useContract";
import { useFarmUser } from "state/farms/hooks";
import { getAddress } from "utils/addressHelpers";
import { fetchFarmUserDataAsync } from "state/farms";
import { getFullDisplayBalance } from "utils/formatBalance";
import useApproveFarm from "views/Farms/hooks/useApproveFarm";
import useStakeFarms from "views/Farms/hooks/useStakeFarm";
import useUnstakeFarms from "views/Farms/hooks/useUnstakeFarm";

import useModal from "hooks/useModal";
import DepositModal from "../DepositModal";
import WithdrawModal from "../WithdrawModal";
import ConnectWalletButton from "components/ConnectWalletButton";

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

const StakeButton = styled(IonButton)`
  width: 36px;
  height: 36px;
  --border-radius: 10px;
`;

export default function StakeActions({ pid, multiplier, lpSymbol, lpAddresses, userDataReady }) {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid);

  const [requestedApproval, setRequestedApproval] = useState(false);

  const isApproved = !!account && allowance && allowance.gt(0);
  const lpAddress = getAddress(lpAddresses);

  const { onApprove } = useApproveFarm(lpAddress);
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

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} lpSymbol={lpSymbol} onConfirm={handleStake} />);
  const [onPresentWithDraw] = useModal(
    <WithdrawModal max={stakedBalance} lpSymbol={lpSymbol} onConfirm={handleUnstake} />
  );

  const renderStakingButtons = () => {
    return isApproved ? (
      <>
        <StakeButton className="ion-no-padding" color="dark" disabled={!account} onClick={onPresentWithDraw}>
          <IonIcon ios={remove} md={remove} />
        </StakeButton>
        <StakeButton className="ion-no-padding" color="primary" disabled={!account} onClick={onPresentDeposit}>
          <IonIcon ios={add} md={add} />
        </StakeButton>
      </>
    ) : (
      <IonButton disabled={!account || requestedApproval} onClick={handleApprove}>
        Approve
      </IonButton>
    );
  };

  return (
    <IonRow style={{ height: "100%" }}>
      {account ? (
        <>
          <IonCol className="ion-no-padding">
            <IonRow className="ion-margin-bottom">
              <Label>{`${lpSymbol} STAKED`}</Label>
            </IonRow>
            <IonRow>
              <AmountLabel>{getFullDisplayBalance(stakedBalance, undefined, 6)}</AmountLabel>
            </IonRow>
          </IonCol>
          <FlexColumn className="ion-no-padding">{renderStakingButtons()}</FlexColumn>
        </>
      ) : (
        <>
          <IonCol className="ion-no-padding">
            <IonRow className="ion-margin-bottom">
              <Label>{`Connect wallet to farm`}</Label>
            </IonRow>
          </IonCol>
          <FlexColumn className="ion-no-padding">
            <ConnectWalletButton />
          </FlexColumn>
        </>
      )}
    </IonRow>
  );
}
