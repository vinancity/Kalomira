import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
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
  height: calc(100% - 15%);
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

export default function Dashboard() {
  const { account } = useWeb3React();
  return (
    <IonContent className="padded-content">
      <IonGrid className="ion-no-padding">
        <IonRow>
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
      </IonGrid>
      <IonCol>
        <StatsCard />
      </IonCol>
    </IonContent>
  );
}
