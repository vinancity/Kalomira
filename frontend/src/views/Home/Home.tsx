import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import {
	IonContent,
	IonCard,
	IonCardHeader,
	IonCardContent,
	IonCardTitle,
} from "@ionic/react";
import { useNativeBalance, useIbKaiBalance } from "hooks/useTokenBalance";
import { getFullDisplayBalance } from "utils/formatBalance";

export default function Home() {
	const { account } = useWeb3React();
	const { balance } = useNativeBalance();
	const { ibKaiBalance } = useIbKaiBalance();

	return (
		<IonContent className="padded-content">
			<IonCard>
				<IonCardHeader color="light">
					<IonCardTitle>Home</IonCardTitle>
				</IonCardHeader>
				<IonCardContent>
					<h1>Address: {account}</h1>
					<h2>{`KAI: ${getFullDisplayBalance(balance, undefined, 8)}`}</h2>
					<h2>{`ibKAI: ${getFullDisplayBalance(
						ibKaiBalance,
						undefined,
						8
					)}`}</h2>
					<p>home</p>
				</IonCardContent>
			</IonCard>
		</IonContent>
	);
}
