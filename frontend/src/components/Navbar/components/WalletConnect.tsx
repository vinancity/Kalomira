import React, { useState, useEffect } from "react";
import { IonButton, IonLabel, useIonModal } from "@ionic/react";

import useAuth from "../../../hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import { ConnectorNames } from "../../../utils/walletTypes";
import WalletModal from "./WalletModal";

export default function WalletConnect() {
	const { login, logout } = useAuth();
	const { account, active } = useWeb3React();
	const [addr, setAddress] = useState(account);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (account) {
			setAddress(account);
		}
	}, [account]);

	function _login(connector: ConnectorNames) {
		login(connector);
	}

	function _logout() {
		logout();
	}

	return (
		<>
			<IonButton color="dark" strong fill="outline" routerDirection="none">
				<IonLabel>{`Account: ${account ? addr : ""}`}</IonLabel>
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
					onClick={() => setShowModal(true)}
				>
					<IonLabel id="foo">Connect</IonLabel>
				</IonButton>
			)}

			<WalletModal
				showModal={showModal}
				setShowModal={setShowModal}
				login={_login}
			/>
		</>
	);
}
