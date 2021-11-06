import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonItem,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import BigNumber from "bignumber.js";
import MintCard from "./components/MintCard";
import RedeemCard from "./components/RedeemCard";

import useGetMintRate from "./hooks/useGetMintRate";
import useGetRedeemRate from "./hooks/useGetRedeemRate";
import { usePollExchangeAllowance } from "state/exchange/hooks";

export const Card = styled(IonCard)`
  border-radius: 15px;
  width: 500px;
  padding: 20px;
`;

export const SubCard = styled(IonCard)`
  border-radius: 15px;
  min-height: 125px;
  width: 500px;
  padding: 20px;
  font-size: 1.25rem;
`;

export const SubCardContent = styled(IonGrid)`
  display: flex;
  flex-flow: column;
  justify-content: space-evenly;
  height: 100%;
  padding: 15px 02px 10px 0px;
`;

export const FlexGrid = styled(IonGrid)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
`;

export const Segment = styled(IonSegment)`
  --background: var(--ion-color-light-shade);
  border-radius: 8px;
  // max-width: 500px;
`;

export const SegmentButton = styled(IonSegmentButton)`
  --background-checked: var(--ion-color-primary);
  --color-checked: var(--ion-color-primary-contrast);
  --background-hover: var(--ion-color-primary);
  --background-hover-opacity: 10%;
  --color: var(--ion-color-primary);
  --indicator-height: 0px;
  --border-radius: 8px;
  transition: 250ms background-color linear;
`;

export default function MintAndRedeem() {
  const [isMint, setMint] = useState(true);
  const [feeAmount, setFeeAmount] = useState("0.0000");
  const { mintPct } = useGetMintRate();
  const { redeemPct } = useGetRedeemRate();
  const { account } = useWeb3React();

  usePollExchangeAllowance();

  const handleChange = (value: string) => {
    value === "mint" ? setMint(true) : setMint(false);
    setFeeAmount("0.0000");
  };

  const calcFeeAmount = (input: string, output: string) => {
    const feeAmt = new BigNumber(input).minus(new BigNumber(output));
    setFeeAmount(feeAmt.isNaN() ? "0.0000" : feeAmt.toFixed(4));
  };

  return (
    <IonContent className="padded-content">
      <FlexGrid className="ion-no-padding">
        <IonGrid>
          <IonRow>
            <Card>
              <IonGrid className="ion-no-padding justify-between">
                <IonRow>
                  <IonCol>
                    <Segment
                      mode="md"
                      value={isMint ? "mint" : "redeem"}
                      onIonChange={(e) => {
                        handleChange(e.detail.value);
                      }}
                    >
                      <SegmentButton value="mint">Mint</SegmentButton>
                      <SegmentButton value="redeem">Redeem</SegmentButton>
                    </Segment>
                  </IonCol>
                </IonRow>
                {isMint ? (
                  <MintCard account={account} afterFetch={calcFeeAmount} />
                ) : (
                  <RedeemCard account={account} afterFetch={calcFeeAmount} />
                )}
              </IonGrid>
            </Card>
          </IonRow>
          <IonRow>
            <SubCard>
              <SubCardContent>
                {isMint ? (
                  <>
                    <IonRow>
                      <IonCol>{`Mint Rate:`}</IonCol>
                      <IonCol className="ion-text-end">{`${mintPct}%`}</IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>{`Mint Fee:`}</IonCol>
                      <IonCol className="ion-text-end">{`${feeAmount}`}</IonCol>
                    </IonRow>
                  </>
                ) : (
                  <>
                    <IonRow>
                      <IonCol>{`Redeem Rate:`}</IonCol>
                      <IonCol className="ion-text-end">{`${redeemPct}%`}</IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>{`Redeem Fee:`}</IonCol>
                      <IonCol className="ion-text-end">{`${feeAmount}`}</IonCol>
                    </IonRow>
                  </>
                )}
              </SubCardContent>
            </SubCard>
          </IonRow>
        </IonGrid>
      </FlexGrid>
    </IonContent>
  );
}
