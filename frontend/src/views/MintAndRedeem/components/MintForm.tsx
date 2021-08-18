import React, { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "utils/bigNumber";
import {
	IonList,
	IonItem,
	IonItemDivider,
	IonInput,
	IonButton,
	IonGrid,
	IonRow,
	IonCol,
} from "@ionic/react";

import { useIbKai } from "hooks/useContract";

export default function MintForm() {
	const [mintAmount, setMintAmount] = useState<BigNumber>(BIG_ZERO);
	const ibKaiContract = useIbKai();

	const calcMintAmt = async (value) => {
		if (value) {
			setMintAmount(value);
		}
	};

	useEffect(() => {
		console.log(mintAmount.toString());
	}, [mintAmount]);

	return (
		<IonList>
			<IonItemDivider color="primary">
				<h2>
					Amount of <b>KAI</b> to deposit:
				</h2>
			</IonItemDivider>
			<IonItem>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonInput
								className="ion-padding"
								placeholder="0"
								inputMode="decimal"
								min="0"
								clearInput
								type="number"
								onIonChange={() => console.log("change")}
								required
							/>
						</IonCol>
						<IonCol className="ion-padding ion-text-right">KAI</IonCol>
					</IonRow>
				</IonGrid>
			</IonItem>
			<IonItemDivider color="primary">
				<h2>
					Amount of <b>ibKAI</b> to mint:
				</h2>
			</IonItemDivider>
			<IonItem>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonInput className="ion-padding" placeholder="0" readonly />
						</IonCol>
						<IonCol className="ion-padding ion-text-right">ibKAI</IonCol>
					</IonRow>
				</IonGrid>
			</IonItem>
			<div className="ion-padding">
				<h2>Mint rate: {0}</h2>
				<h2>Mint fee: {0}</h2>
			</div>
			<IonButton expand="full">Mint</IonButton>
			<IonItemDivider />
		</IonList>
	);
}
