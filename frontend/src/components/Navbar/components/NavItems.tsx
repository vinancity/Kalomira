import { useState } from "react";
import { IonButton, IonIcon, IonLabel, IonList, IonItem, IonPopover } from "@ionic/react";
import { navItems } from "../NavItem";

export default function NavItems() {
  return (
    <>
      {navItems.map((navItem, index) => {
        return <PopoverMenu navItem={navItem} key={index} />;
      })}
    </>
  );
}

export const PopoverMenu = ({ navItem }) => {
  const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });
  const { title, menuItems } = navItem;

  return (
    <>
      {Object.keys(menuItems).length > 0 && (
        <IonPopover
          cssClass={`${title}`}
          event={popoverState.event}
          isOpen={popoverState.showPopover}
          showBackdrop={false}
          animated={false}
          onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
        >
          <IonList lines="none">
            {Object.keys(menuItems).map((menuItem, index) => {
              return (
                <IonItem button routerLink={menuItems[menuItem]} key={index}>
                  {menuItem}
                </IonItem>
              );
            })}
          </IonList>
        </IonPopover>
      )}
      <IonButton
        // color="dark"
        strong
        fill="clear"
        routerLink={navItem.url}
        routerDirection="none"
        className="navbar-button"
        onMouseOver={(e: any) => {}}
        onMouseLeave={(e: any) => {}}
        onClick={(e: any) => {
          console.log(e);
          e.persist();
          setShowPopover({ showPopover: true, event: e });
        }}
      >
        <IonIcon slot="start" ios={navItem.iosIcon} md={navItem.mdIcon} />
        <IonLabel>{navItem.title}</IonLabel>
      </IonButton>
    </>
  );
};
