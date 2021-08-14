import { InjectedConnector as EthConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { KaiConnector } from "@becoswap-libs/kai-connector";
//import { ConnectorNames } from "@pancakeswap/uikit";
import { ConnectorNames } from "./walletTypes";
import { ethers } from "ethers";
import getNodeUrl from "./getRpcUrl";

const POLLING_INTERVAL = 12000;
const rpcUrl = getNodeUrl();
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID as string, 10);

const injected = new EthConnector({ supportedChainIds: [chainId, 1] });

const walletconnect = new WalletConnectConnector({
	rpc: { [chainId]: rpcUrl } as any,
	bridge: "https://pancakeswap.bridge.walletconnect.org/",
	qrcode: true,
	pollingInterval: POLLING_INTERVAL,
});

const kaiConnector = new KaiConnector({ supportedChainIds: [69, 0] });

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
	[ConnectorNames.Injected]: injected,
	[ConnectorNames.WalletConnect]: walletconnect,
	[ConnectorNames.KAI]: kaiConnector,
	[ConnectorNames.BSC]: undefined,
};

export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
	const library = new ethers.providers.Web3Provider(provider);
	library.pollingInterval = POLLING_INTERVAL;
	return library;
};
