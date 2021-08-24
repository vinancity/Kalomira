import React from "react";
import {
	IonContent,
	IonGrid,
	IonRow,
	IonCol,
	IonCard,
	IonCardHeader,
	IonCardContent,
	IonCardTitle,
	IonIcon,
	IonButton,
} from "@ionic/react";

export default function FarmCard({ lpLabel }) {
	return (
		<IonCard>
			<IonCardHeader color="light">
				<IonGrid>
					<IonRow>
						<IonCol>Farm</IonCol>
						<IonCol>Earned</IonCol>
						<IonCol>Multiplier</IonCol>
					</IonRow>
					<IonRow>
						<IonCol>{lpLabel}</IonCol>
						<IonCol>{"0.0000"}</IonCol>
						<IonCol>{"1x"}</IonCol>
					</IonRow>
				</IonGrid>
			</IonCardHeader>

			<IonCardContent>
				<IonGrid>
					<IonRow>
						<IonCol>
							<IonRow>KALO EARNED</IonRow>
							<IonRow>{"0.0000"}</IonRow>
							<IonRow>
								<IonButton>Harvest</IonButton>
							</IonRow>
						</IonCol>
						<IonCol>
							<IonRow>{"ibKAI-QUOTE"}</IonRow>
							<IonRow>{"0.0000"}</IonRow>
							<IonRow>
								<IonButton color="danger">Unstake</IonButton>
								<IonButton color="success">Stake</IonButton>
							</IonRow>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonCardContent>
		</IonCard>
	);
}
