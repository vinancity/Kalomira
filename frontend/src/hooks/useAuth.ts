import { useCallback } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { NoBscProviderError } from "@becoswap-libs/kai-connector";
import {
	NoEthereumProviderError,
	UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
	UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
	WalletConnectConnector,
} from "@web3-react/walletconnect-connector";
import { ConnectorNames, connectorLocalStorageKey } from "@pancakeswap/uikit";
import { connectorsByName } from "../utils/web3React";
import { useAppDispatch } from "../state";

const useAuth = () => {
	const dispath = useAppDispatch();
	const { chainId, account, activate, deactivate, active } = useWeb3React();

	const login = useCallback((connectorID: ConnectorNames) => {
		const connector = connectorsByName[connectorID];
		if (connector) {
			activate(connector);
		}
	}, []);

	const logout = useCallback(() => {
		deactivate();
	}, []);

	return { login, logout };
};

export default useAuth;
