import { IonHeader, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonLabel } from "@ionic/react";
import WalletConnect from "./components/WalletConnect";
import NavItems from "./components/NavItems";

export default function Navbar() {
  return (
    <IonHeader mode="md">
      <IonToolbar>
        <IonGrid className="ion-no-padding">
          <IonRow className="">
            <IonCol size="auto">
              <IonButton fill="clear" className="navbar-logo" routerLink="/home" shape="round" strong>
                <IonLabel>Kalos</IonLabel>
              </IonButton>
              <NavItems />
            </IonCol>
            <IonCol className="ion-text-right">
              <WalletConnect />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonToolbar>
    </IonHeader>
  );
}
