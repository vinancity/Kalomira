//import React from "react";
import { useWeb3React } from "@web3-react/core";

import {
	IonButtons,
	IonContent,
	IonGrid,
	IonRow,
	IonCol,
	IonCard,
	IonCardHeader,
	IonCardContent,
	IonCardTitle,
	IonButton,
} from "@ionic/react";

export default function Home() {
	const { account } = useWeb3React();
	return (
		<IonContent className="ion-padding">
			<IonCard>
				<IonCardHeader color="light">
					<IonCardTitle>
						<IonGrid>
							<IonRow>
								<IonCol>
									<IonButton expand="block" color="dark">
										<b>Mint</b>
									</IonButton>
								</IonCol>
								<IonCol>
									<IonButton expand="block" color="dark">
										<b>Redeem</b>
									</IonButton>
								</IonCol>
							</IonRow>
						</IonGrid>
					</IonCardTitle>
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
