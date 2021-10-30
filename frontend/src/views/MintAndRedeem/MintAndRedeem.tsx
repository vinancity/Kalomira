import { useState, useEffect } from "react";
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

import MintCard from "./components/MintCard";

import useGetMintRate from "./hooks/useGetMintRate";

export const Card = styled(IonCard)`
  border-radius: 15px;
  width: 500px;
  padding: 20px;
`;

export const SubCard = styled(IonCard)`
  border-radius: 15px;
  min-height: 150px;
  width: 500px;
  padding: 20px;
`;

export const FlexGrid = styled(IonGrid)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
`;

export const InputGrid = styled(IonGrid)`
  display: flex;
  flex-flow: column;
  height: 100%;
  padding: 15px 02px 10px 0px;
`;

export const AmountLabel = styled(IonLabel)`
  font-size: 2rem;
  font-weight: bold;
  color: var(--ion-color-dark);
`;

export const InputWrapper = styled(IonItem)`
  --min-height: 130px;
  margin: 5px 0px 5px 0px;
  border-radius: 8px;
  --background: var(--ion-color-light-tint);
  --border-style: none;
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
  const [isMint, setMint] = useState("mint");
  const { mintRate, mintPct } = useGetMintRate();
  const { account } = useWeb3React();

  const handleChange = (value: string) => {
    value === "mint" ? setMint("mint") : setMint("redeem");
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
                      value={isMint}
                      onIonChange={(e) => {
                        handleChange(e.detail.value);
                      }}
                    >
                      <SegmentButton value="mint">Mint</SegmentButton>
                      <SegmentButton value="redeem">Redeem</SegmentButton>
                    </Segment>
                  </IonCol>
                </IonRow>
                <MintCard account={account} />
              </IonGrid>
            </Card>
          </IonRow>
          <IonRow>
            <SubCard>
              {isMint === "mint" ? (
                <>
                  <div>{`Mint Rate: ${mintPct}% | ${mintRate}`}</div>
                  <div>{`Mint Fee: 123`}</div>
                </>
              ) : (
                <>
                  <div>{`Redeem Rate: ${mintPct}% | ${mintRate}`}</div>
                  <div>{`Redeem Fee: 123`}</div>
                </>
              )}
            </SubCard>
          </IonRow>
        </IonGrid>
      </FlexGrid>
    </IonContent>
  );
}
