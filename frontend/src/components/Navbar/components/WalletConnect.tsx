import React, { useState, useEffect } from "react";
import { IonButton, IonLabel } from "@ionic/react";

import useAuth from "hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import { ConnectorNames } from "utils/walletTypes";
import truncateAddress from "utils/truncateAddress";
import WalletModal from "./WalletModal";

export default function WalletConnect() {
	const { login, logout } = useAuth();
	const { account, active, connector, chainId, library } = useWeb3React();
	const [addr, setAddress] = useState(account);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (account) {
			setAddress(account);
		}
		const log = async () => {
			if (connector) {
				console.log(chainId, library, await connector.getChainId());
			}
		};
		log();
	}, [account]);

	const _login = (connector: ConnectorNames) => {
		login(connector);
	};

	const _logout = () => {
		logout();
	};

	return (
		<>
			{active && (
				<>
					<IonButton color="dark" strong fill="clear" routerDirection="none">
						<IonLabel>{`KAI: ${0}`}</IonLabel>
					</IonButton>
					<IonButton color="dark" strong fill="clear" routerDirection="none">
						<IonLabel>{`ibKAI: ${0}`}</IonLabel>
					</IonButton>
					<IonButton color="success" strong fill="clear" routerDirection="none">
						<IonLabel>{`${addr ? truncateAddress(addr, 6) : ""}`}</IonLabel>
					</IonButton>
				</>
			)}

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
