import React from "react";
import {
	IonHeader,
	IonToolbar,
	IonRow,
	IonCol,
	IonButton,
	IonIcon,
	IonItem,
	IonLabel,
} from "@ionic/react";

import useAuth from "../../../hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import { ConnectorNames } from "@pancakeswap/uikit";

export default function WalletInfo() {
	const { login, logout } = useAuth();
	const { account, active } = useWeb3React();

	function _login() {
		login(ConnectorNames.Injected);
	}

	function _logout() {
		logout();
		console.log("Logging out");
	}

	return (
		<>
			<IonButton color="dark" strong fill="outline" routerDirection="none">
				<IonLabel>{`Active: ${active}`}</IonLabel>
			</IonButton>
			<IonButton color="dark" strong fill="outline" routerDirection="none">
				<IonLabel>{`Account: ${account ? account : ""}`}</IonLabel>
			</IonButton>

			{active ? (
				<IonButton
					color="dark"
					strong
					fill="outline"
					routerDirection="none"
					onClick={_logout}
				>
					<IonLabel id="foo">Disconnect</IonLabel>
				</IonButton>
			) : (
				<IonButton
					color="dark"
					strong
					fill="outline"
					routerDirection="none"
					onClick={_login}
				>
					<IonLabel id="foo">Connect</IonLabel>
				</IonButton>
			)}
		</>
	);
}
