import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import { IonContent, IonCard, IonCardContent, IonCardTitle, IonLabel, IonGrid, IonRow, IonCol } from "@ionic/react";
import AccountCard from "./components/AccountCard";
import FarmsCard from "./components/FarmsCard";
import TreasuryCard from "./components/TreasuryCard";
import StatsCard from "./components/StatsCard";

export const CardTitle = styled(IonCardTitle)`
  font-weight: bold;
  font-size: 1.5rem;
`;

export const DashboardCard = styled(IonCard)`
  border-radius: 15px;
  height: 100%;
`;

export const CardContent = styled(IonCardContent)`
  height: 84.5%;
`;

export const Header = styled(IonLabel)`
  font-size: 1.75rem;
  color: var(--ion-color-dark);
`;

export const AmountLabel = styled(IonLabel)`
  font-size: 3rem;
  font-weight: bold;
  color: var(--ion-color-dark);
`;

export const DollarLabel = styled(IonLabel)`
  font-size: 1rem;
  color: var(--ion-color-medium);
`;

export const Container = styled.div`
  background: white;
  width: 100%;
  height: 100%;
`;

export const FlexGrid = styled(IonGrid)`
  display: flex;
  flex-flow: column;
`;

export default function Dashboard() {
  const { account } = useWeb3React();
  return (
    <IonContent className="padded-content">
      <FlexGrid className="ion-no-padding">
        <IonRow className="ion-margin-bottom">
          <IonCol>
            <AccountCard account={account} />
          </IonCol>
          <IonCol>
            <FarmsCard account={account} />
          </IonCol>
          <IonCol>
            <TreasuryCard account={account} />
          </IonCol>
        </IonRow>
        <IonRow className="ion-margin-top">
          <IonCol>
            <StatsCard />
          </IonCol>
        </IonRow>
      </FlexGrid>
    </IonContent>
  );
}
