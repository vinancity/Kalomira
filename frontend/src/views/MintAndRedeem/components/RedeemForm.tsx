import React from "react";
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

export default function RedeemForm() {
	return (
		<IonList>
			<IonItemDivider color="primary">
				<h2>
					Amount of <b>ibKAI</b> to return:
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
								required
							/>
						</IonCol>
						<IonCol className="ion-padding ion-text-right">ibKAI</IonCol>
					</IonRow>
				</IonGrid>
			</IonItem>
			<IonItemDivider color="primary">
				<h2>
					Amount of <b>KAI</b> to redeem:
				</h2>
			</IonItemDivider>
			<IonItem>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonInput className="ion-padding" placeholder="0" readonly />
						</IonCol>
						<IonCol className="ion-padding ion-text-right">KAI</IonCol>
					</IonRow>
				</IonGrid>
			</IonItem>
			<div className="ion-padding">
				<h2>Mint rate: {0}</h2>
				<h2>Mint fee: {0}</h2>
			</div>
			<IonButton expand="full">Redeem</IonButton>
			<IonItemDivider />
		</IonList>
	);
}
