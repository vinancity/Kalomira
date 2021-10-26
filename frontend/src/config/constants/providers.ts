import { ConnectorNames } from "utils/walletTypes";

export interface ProviderItem {
  name: string;
  connector: ConnectorNames;
}

export const ProviderItems: ProviderItem[] = [
  { name: "Metamask", connector: ConnectorNames.Injected },
  { name: "KAI Wallet", connector: ConnectorNames.KAI },
  { name: "Binance Chain Wallet", connector: ConnectorNames.BSC },
  { name: "Wallet Connect", connector: ConnectorNames.WalletConnect },
];
