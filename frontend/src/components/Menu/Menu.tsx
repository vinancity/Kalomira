import React from "react";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  homeOutline,
  homeSharp,
  rocketOutline,
  rocketSharp,
  layersOutline,
  layers,
  gridOutline,
  grid,
} from "ionicons/icons";
import "./Menu.css";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Home",
    url: "/home",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: "Mint & Redeem",
    url: "/mintredeem",
    iosIcon: rocketOutline,
    mdIcon: rocketSharp,
  },
  {
    title: "Farms",
    url: "/farms",
    iosIcon: layersOutline,
    mdIcon: layers,
  },
  {
    title: "More",
    url: "/more",
    iosIcon: gridOutline,
    mdIcon: grid,
  },
];

function Menu() {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Kalomira</IonListHeader>
          <IonNote>Trade, Yield Farm, and Stake to earn KALO</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={location.pathname === appPage.url ? "selected" : ""}
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
}

export default Menu;
