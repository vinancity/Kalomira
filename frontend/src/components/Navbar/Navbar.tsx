import React from "react";
import {
	IonHeader,
	IonToolbar,
	IonRow,
	IonCol,
	IonButton,
	IonIcon,
	IonLabel,
} from "@ionic/react";

import WalletInfo from "./components/WalletInfo";

import { navItems } from "./NavItem";

export default function Navbar() {
	return (
		<IonHeader mode="ios">
			<IonToolbar>
				<IonRow>
					<IonCol size="0.5">
						<img src="./favicon.png" height="50" />
					</IonCol>
					<IonCol size="6">
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
									<IonIcon
										slot="start"
										ios={navItem.iosIcon}
										md={navItem.mdIcon}
									/>
									<IonLabel>{navItem.title}</IonLabel>
								</IonButton>
							);
						})}
					</IonCol>
					<IonCol className="ion-text-right">
						<WalletInfo />
					</IonCol>
				</IonRow>
			</IonToolbar>
		</IonHeader>
	);
}
