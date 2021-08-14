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
} from "@ionic/react";

export default function Home() {
	const { account } = useWeb3React();
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Dashboard</IonTitle>
					</IonToolbar>
				</IonHeader>
				<h1>Address: {account}</h1>
				<h2>ETH: {0}</h2>
			</IonContent>
		</IonPage>
	);
}
