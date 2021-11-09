import { useEffect, useState, useCallback } from "react";
import { useNativeBalance, useIbKaiBalance } from "hooks/useTokenBalance";
import { getFullDisplayBalance, getBalanceAmount } from "utils/formatBalance";
import { useExchangeAllowance } from "state/exchange/hooks";
import { fetchExchangeAllowanceAsync } from "state/exchange";
import { useAppDispatch } from "state";
import useDebounce from "hooks/useDebounce";
import useGetRedeemAmount from "../hooks/useGetRedeemAmount";
import useApproveIbKAI from "../hooks/useApproveIbKAI";
import useRedeemKai from "../hooks/useRedeemKai";

import styled from "styled-components";
import { IonRow, IonCol, IonButton, IonIcon } from "@ionic/react";
import { arrowDown } from "ionicons/icons";
import { Input } from "components/Input/Input";
import ConnectWalletButton from "components/ConnectWalletButton";

const Divider = styled(IonRow)`
  margin: 10px 0px;
  height: 30px;
`;

export default function RedeemCard({ account, afterFetch }) {
  const dispatch = useAppDispatch();
  const [pendingTx, setPendingTx] = useState(false);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const { balance, refresh: refreshNative } = useNativeBalance();
  const { ibKaiBalance, refresh: refreshIbKai } = useIbKaiBalance();
  const { onGetRedeemAmount } = useGetRedeemAmount();
  const { onApprove } = useApproveIbKAI();
  const { onRedeem } = useRedeemKai();
  const allowance = useExchangeAllowance();
  const debouncedFromValue = useDebounce(fromValue, 300);

  const isApproved = account && allowance && allowance.isGreaterThan(0);

  const handleMax = useCallback(() => {
    setFromValue(getFullDisplayBalance(ibKaiBalance));
  }, [ibKaiBalance]);

  const handleRedeem = async () => {
    setPendingTx(true);
    try {
      await onRedeem(fromValue);
    } catch (error) {
      console.error(error);
    } finally {
      setPendingTx(false);
      refreshNative();
      refreshIbKai();
    }
  };

  const handleApprove = async () => {
    try {
      setPendingTx(true);
      await onApprove();
      dispatch(fetchExchangeAllowanceAsync({ account }));
      setPendingTx(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onUserInput = (nextInput: string) => {
    setFromValue(nextInput);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchRedeemOutput = async () => {
      const toAmount = await onGetRedeemAmount(debouncedFromValue);
      if (toAmount.isZero()) {
        setToValue("");
      } else {
        setToValue(getBalanceAmount(toAmount).toString());
      }
      afterFetch(fromValue, getBalanceAmount(toAmount).toString());
    };

    if (isMounted) {
      fetchRedeemOutput();
    }
    return () => {
      isMounted = false;
    };
  }, [debouncedFromValue, onGetRedeemAmount]);

  return (
    <>
      <IonRow style={{ marginTop: "35px" }}>
        <IonCol>
          <Input
            value={fromValue}
            label1="From"
            label2={account ? `Balance: ${getFullDisplayBalance(ibKaiBalance, undefined, 4)}` : "Balance: 0.0000"}
            tokenLabel="ibKAI"
            onUserInput={onUserInput}
            withMax={true}
            onMax={handleMax}
          />
        </IonCol>
      </IonRow>

      <Divider className="ion-align-items-center ion-justify-content-center">
        <IonIcon md={arrowDown} style={{ height: "100%", width: "100%" }}></IonIcon>
      </Divider>

      <IonRow style={{ marginBottom: "35px" }}>
        <IonCol>
          <Input
            value={toValue}
            label1="To"
            label2={account ? `Balance: ${getFullDisplayBalance(balance, undefined, 4)}` : "Balance: 0.0000"}
            tokenLabel="KAI"
            readonly={true}
            withMax={false}
          />
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol>
          {account ? (
            isApproved ? (
              <IonButton expand="block" disabled={!toValue || pendingTx} onClick={handleRedeem}>
                Redeem
              </IonButton>
            ) : (
              <IonButton expand="block" disabled={isApproved || pendingTx} onClick={handleApprove}>
                Enable
              </IonButton>
            )
          ) : (
            <ConnectWalletButton style={{ display: "block" }} />
          )}
        </IonCol>
      </IonRow>
    </>
  );
}
