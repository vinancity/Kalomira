import styled from "styled-components";
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";

import { CardTitle, DollarLabel } from "../Dashboard";

const StatCard = styled(IonCard)`
  border-radius: 15px;
`;

const StatsAmountLabel = styled(IonLabel)`
  font-size: 2rem;
  font-weight: bold;
  color: var(--ion-color-dark);
`;

export default function StatsCard() {
  return (
    <StatCard>
      <IonCardHeader color="light">
        <IonRow>
          <IonCol className="ion-no-padding">
            <CardTitle>Kalos Stats</CardTitle>
          </IonCol>
          <IonCol className="ion-no-padding ion-text-right">
            <CardTitle>$123,456,789</CardTitle>
          </IonCol>
          <IonCol className="ion-no-padding ion-text-right ion-margin-start ion-align-self-end" size="auto">
            <DollarLabel>TVL</DollarLabel>
          </IonCol>
        </IonRow>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid className="ion-margin-top">
          <IonRow>
            <IonCol>
              <DollarLabel>Market Cap</DollarLabel>
            </IonCol>
            <IonCol>
              <DollarLabel>Circulating Supply</DollarLabel>
            </IonCol>
            <IonCol>
              <DollarLabel>New KALO/Block</DollarLabel>
            </IonCol>
            <IonCol>
              <DollarLabel>Supported Pairs</DollarLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="">
              <StatsAmountLabel>$0.00</StatsAmountLabel>
            </IonCol>
            <IonCol>
              <StatsAmountLabel>0</StatsAmountLabel>
            </IonCol>
            <IonCol>
              <StatsAmountLabel>0</StatsAmountLabel>
            </IonCol>
            <IonCol>
              <StatsAmountLabel>0</StatsAmountLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </StatCard>
  );
}
