import { useEffect, useState } from "react";
import { InputChangeEventDetail } from "@ionic/core";
import { IonRow, IonCol, IonButton, IonIcon, IonInput, IonAvatar, IonImg } from "@ionic/react";
import { arrowDown } from "ionicons/icons";
import styled from "styled-components";
import { useNativeBalance, useIbKaiBalance } from "hooks/useTokenBalance";
import { getFullDisplayBalance, getBalanceAmount } from "utils/formatBalance";

import { InputWrapper } from "../MintAndRedeem";
import { InputGrid } from "../MintAndRedeem";
import ConnectWalletButton from "components/ConnectWalletButton";

import useDebounce from "hooks/useDebounce";
import useGetMintAmount from "../hooks/useGetMintAmount";
import useApproveIbKAI from "../hooks/useApproveIbKAI";
import useMintIbKai from "../hooks/useMintIbKai";
import { useExchangeAllowance } from "state/exchange/hooks";

const NumericalInput = styled(IonInput)`
  // --background: var(--ion-card-background);
  --color: var(--ion-color-dark);
  font-size: 2rem;
  font-weight: bold;
  border-radius: 8px;
`;

const Divider = styled(IonRow)`
  margin: 10px 0px;
  height: 30px;
`;

export default function MintCard({ account }) {
  const [pendingTx, setPendingTx] = useState(false);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const { balance } = useNativeBalance();
  const { ibKaiBalance } = useIbKaiBalance();
  const { onGetMintAmount } = useGetMintAmount();
  const { onApprove } = useApproveIbKAI();
  const { onMint } = useMintIbKai();
  const allowance = useExchangeAllowance();
  const debouncedFromValue = useDebounce(fromValue, 300);

  const isApproved = account && allowance && allowance.isGreaterThan(0);

  const inputRegex = RegExp(`^[0-9]*(?:[.])?[0-9]{0,18}$`);
  const handleMax = () => {
    setFromValue(getFullDisplayBalance(balance));
  };
  const handleKeyPress = (e) => {
    if (!inputRegex.test(fromValue + e.key)) {
      e.preventDefault();
    }
  };

  const handleMint = async () => {
    setPendingTx(true);
    await onMint(fromValue);
    setPendingTx(false);
  };

  const handleApprove = async () => {
    setPendingTx(true);
    await onApprove();
    setPendingTx(false);
  };

  const handleFromChange = (e: CustomEvent<InputChangeEventDetail>) => {
    if (inputRegex.test(e.detail.value)) {
      e.preventDefault();
      setFromValue(e.detail.value);
    }
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
    };

    fetchMintOutput();
  }, [debouncedFromValue, onGetMintAmount]);

  return (
    <>
      <IonRow style={{ marginTop: "35px" }}>
        <IonCol>
          <InputWrapper>
            <InputGrid className="ion-align-self-start">
              <IonRow className="ion-align-items-center ion-margin-bottom">
                <IonCol>From</IonCol>
                <IonCol size="auto">
                  <IonButton className="ion-no-margin" onClick={handleMax}>
                    MAX
                  </IonButton>
                </IonCol>
                <IonCol size="auto" className="ion-text-end ion-margin-start">
                  {account ? `Balance: ${getFullDisplayBalance(balance, undefined, 4)}` : `Balance: 0.0000`}
                </IonCol>
              </IonRow>
              <IonRow className="ion-align-items-center" style={{ flexGrow: 1 }}>
                <IonCol>
                  <NumericalInput
                    placeholder="0.000"
                    value={fromValue}
                    onKeyPress={(e) => handleKeyPress(e)}
                    onIonChange={(e) => handleFromChange(e)}
                    autofocus={true}
                  />
                </IonCol>
                <IonCol size="auto" className="ion-text-center">
                  <IonAvatar style={{ transform: "scale(0.8)" }}>
                    <IonImg src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
                  </IonAvatar>
                </IonCol>
                <IonCol size="1.5" className="ion-text-center">
                  KAI
                </IonCol>
              </IonRow>
            </InputGrid>
          </InputWrapper>
        </IonCol>
      </IonRow>

      <Divider className="ion-align-items-center ion-justify-content-center">
        <IonIcon md={arrowDown} style={{ height: "100%", width: "100%" }}></IonIcon>
      </Divider>

      <IonRow style={{ marginBottom: "35px" }}>
        <IonCol>
          <InputWrapper>
            <InputGrid className="ion-align-self-start">
              <IonRow className="ion-align-items-center ion-margin-bottom">
                <IonCol>To</IonCol>
                <IonCol className="ion-text-end">
                  {account ? `Balance: ${getFullDisplayBalance(ibKaiBalance, undefined, 4)}` : `Balance: 0.0000`}
                </IonCol>
              </IonRow>
              <IonRow className="ion-align-items-center" style={{ flexGrow: 1 }}>
                <IonCol>
                  <NumericalInput placeholder="0.000" value={toValue} readonly />
                </IonCol>
                <IonCol size="auto">
                  <IonAvatar style={{ transform: "scale(0.8)" }}>
                    <IonImg src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
                  </IonAvatar>
                </IonCol>
                <IonCol size="1.5" className="ion-text-center">
                  ibKAI
                </IonCol>
              </IonRow>
            </InputGrid>
          </InputWrapper>
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
