import React from "react";
import { IonHeader, IonToolbar, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonLabel } from "@ionic/react";
import WalletConnect from "./components/WalletConnect";
import { navItems } from "./NavItem";

export default function Navbar() {
  return (
    <IonHeader mode="md">
      <IonToolbar>
        <IonGrid>
          <IonRow className="ion-text-right">
            <IonCol size="7.5">
              {navItems.map((navItem, index) => {
                return (
                  <IonButton
                    color="dark"
                    strong
                    fill="clear"
                    key={index}
                    routerLink={navItem.url}
                    routerDirection="none"
                  >
                    <IonIcon slot="start" ios={navItem.iosIcon} md={navItem.mdIcon} />
                    <IonLabel>{navItem.title}</IonLabel>
                  </IonButton>
                );
              })}
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
