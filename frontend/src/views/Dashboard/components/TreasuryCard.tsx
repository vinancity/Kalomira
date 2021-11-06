import styled from "styled-components";
import { IonGrid, IonRow, IonCol, IonButton, IonCardHeader } from "@ionic/react";
import { Header, AmountLabel, DollarLabel, DashboardCard, CardTitle, CardContent } from "../Dashboard";
import ConnectWalletButton from "components/ConnectWalletButton";

const Content = styled(IonGrid)`
  height: 100%;
  display: flex;
  flex-flow: column;
`;

export default function TreasuryCard({ account }) {
  return (
    <DashboardCard>
      <IonCardHeader color="light">
        <CardTitle>Treasury</CardTitle>
      </IonCardHeader>
      <CardContent>
        <Content className="ion-margin-top">
          <IonRow style={{ flexGrow: "1" }}>
            <IonCol>
              <IonRow>
                <Header>USDT to collect:</Header>
              </IonRow>
              <IonRow>
                <AmountLabel>{account ? "$123.5467" : "$0.0000"}</AmountLabel>
              </IonRow>
              <IonRow>
                <DollarLabel>{account ? "$123.54" : "$0.00"}</DollarLabel>
              </IonRow>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {account ? (
                <IonButton expand="block" routerLink="/treasury">
                  Collect
                </IonButton>
              ) : (
                <ConnectWalletButton style={{ display: "block" }} />
              )}
            </IonCol>
          </IonRow>
        </Content>
      </CardContent>
    </DashboardCard>
  );
}
