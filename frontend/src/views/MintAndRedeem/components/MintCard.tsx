import { useEffect, useState } from "react";
import { useNativeBalance, useIbKaiBalance } from "hooks/useTokenBalance";
import { getFullDisplayBalance, getBalanceAmount } from "utils/formatBalance";
import { useExchangeAllowance } from "state/exchange/hooks";
import { fetchExchangeAllowanceAsync } from "state/exchange";
import { useAppDispatch } from "state";
import useDebounce from "hooks/useDebounce";
import useGetMintAmount from "../hooks/useGetMintAmount";
import useApproveIbKAI from "../hooks/useApproveIbKAI";
import useMintIbKai from "../hooks/useMintIbKai";

import styled from "styled-components";
import { IonRow, IonCol, IonButton, IonIcon } from "@ionic/react";
import { arrowDown } from "ionicons/icons";
import { Input } from "components/Input/Input";
import ConnectWalletButton from "components/ConnectWalletButton";

const Divider = styled(IonRow)`
  margin: 10px 0px;
  height: 30px;
`;

export default function MintCard({ account, afterFetch }) {
  const dispatch = useAppDispatch();
  const [pendingTx, setPendingTx] = useState(false);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const { balance, refresh: refreshNative } = useNativeBalance();
  const { ibKaiBalance, refresh: refreshIbKai } = useIbKaiBalance();
  const { onGetMintAmount } = useGetMintAmount();
  const { onApprove } = useApproveIbKAI();
  const { onMint } = useMintIbKai();
  const allowance = useExchangeAllowance();
  const debouncedFromValue = useDebounce(fromValue, 300);

  const isApproved = account && allowance && allowance.isGreaterThan(0);

  const handleMax = () => {
    setFromValue(getFullDisplayBalance(balance));
  };

  const handleMint = async () => {
    setPendingTx(true);
    try {
      await onMint(fromValue);
    } catch (error) {
      console.error(error);
    } finally {
      setPendingTx(false);
      refreshNative();
      refreshIbKai();
    }
  };

  const handleApprove = async () => {
    setPendingTx(true);
    try {
      await onApprove();
      dispatch(fetchExchangeAllowanceAsync({ account }));
    } catch (error) {
      console.error(error);
    } finally {
      setPendingTx(false);
    }
  };

  const onUserInput = (nextInput: string) => {
    setFromValue(nextInput);
  };

  // Call mint query after debounce completes
  useEffect(() => {
    const fetchMintOutput = async () => {
      const toAmount = await onGetMintAmount(debouncedFromValue);
      if (toAmount.isZero()) {
        setToValue("");
      } else {
        setToValue(getBalanceAmount(toAmount).toString());
      }
      afterFetch(fromValue, getBalanceAmount(toAmount).toString());
    };

    fetchMintOutput();
  }, [debouncedFromValue, onGetMintAmount]);

  return (
    <>
      <IonRow style={{ marginTop: "35px" }}>
        <IonCol>
          <Input
            value={fromValue}
            label1="From"
            label2={account ? `Balance: ${getFullDisplayBalance(balance, undefined, 4)}` : "Balance: 0.0000"}
            tokenLabel="KAI"
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
            label2={account ? `Balance: ${getFullDisplayBalance(ibKaiBalance, undefined, 4)}` : "Balance: 0.0000"}
            tokenLabel="ibKAI"
            readonly={true}
            withMax={false}
          />
        </IonCol>
      </IonRow>

      <IonRow style={{}}>
        <IonCol>
          {account ? (
            isApproved ? (
              <IonButton expand="block" disabled={!toValue || pendingTx} onClick={handleMint}>
                Mint
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
