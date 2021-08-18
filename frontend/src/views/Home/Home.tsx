import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import {
	IonContent,
	IonCard,
	IonCardHeader,
	IonCardContent,
	IonCardTitle,
} from "@ionic/react";
import { useNativeBalance } from "hooks/useTokenBalance";
import { getFullDisplayBalance } from "utils/formatBalance";

export default function Home() {
	const { account } = useWeb3React();
	const { balance, fetchStatus, refresh } = useNativeBalance();

	useEffect(() => {
		console.log(balance.toString());
	}, [balance]);

	return (
		<IonContent className="ion-padding">
			<IonCard>
				<IonCardHeader color="light">
					<IonCardTitle>Home</IonCardTitle>
				</IonCardHeader>
				<IonCardContent>
					<h1>Address: {account}</h1>
					<h2>KAI: {getFullDisplayBalance(balance).toString()}</h2>
					<p>home</p>
				</IonCardContent>
			</IonCard>
		</IonContent>
	);
}
