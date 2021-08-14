//import React from "react";
import { useWeb3React } from "@web3-react/core";

import {
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
	IonCard,
	IonCardHeader,
	IonCardContent,
	IonCardTitle,
} from "@ionic/react";
import "../../theme/variables.css";

export default function Home() {
	const { account } = useWeb3React();
	return (
		<IonContent className="ion-padding">
			<IonCard>
				<IonCardHeader color="light">
					<IonCardTitle>Home</IonCardTitle>
				</IonCardHeader>
				<IonCardContent>
					<h1>Address: {account}</h1>
					<h2>ETH: {0}</h2>
					<p>home</p>
				</IonCardContent>
			</IonCard>
		</IonContent>
	);
}
