import styled from "styled-components";
import { IonGrid, IonRow, IonCol, IonLabel } from "@ionic/react";
import { Header, AmountLabel, DollarLabel } from "../Dashboard";

export default function FarmsCard() {
  return (
    <IonGrid className="ion-margin-top">
      <IonRow>
        <Header>Kalo to collect:</Header>
      </IonRow>
      <IonRow>
        <AmountLabel>123.546</AmountLabel>
      </IonRow>
      <IonRow>
        <DollarLabel>$123.546</DollarLabel>
      </IonRow>
    </IonGrid>
  );
}
