import { InjectedConnector as EthConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { KaiConnector } from "@becoswap-libs/kai-connector";
//import { ConnectorNames } from "@pancakeswap/uikit";
import { ConnectorNames } from "./walletTypes";
import { ethers } from "ethers";

const POLLING_INTERVAL = 12000;
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);

const injected = new EthConnector({ supportedChainIds: [chainId, 1] });

const kaiConnector = new KaiConnector({ supportedChainIds: [chainId, 69, 0] });

export const connectorsByName: { [connectorName in ConnectorNames] } = {
	[ConnectorNames.Injected]: injected,
	[ConnectorNames.WalletConnect]: undefined,
	[ConnectorNames.KAI]: kaiConnector,
	[ConnectorNames.BSC]: undefined,
};

export const getLibrary = (provider): ethers.providers.Web3Provider => {
	const library = new ethers.providers.Web3Provider(provider);
	library.pollingInterval = POLLING_INTERVAL;
	return library;
};
