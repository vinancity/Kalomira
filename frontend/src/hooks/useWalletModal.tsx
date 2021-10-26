import useModal from "./useModal";
import WalletModal from "components/Modal/WalletModal";
import ProviderModal from "components/Modal/ProviderModal";
import ChainModal from "components/Modal/ChainModal";

import { ConnectorNames } from "utils/walletTypes";

export type Login = (connectorId: ConnectorNames) => void;

interface ReturnType {
  onPresentConnectModal: () => void;
  onPresentAccountModal: () => void;
  onPresentChainModal: () => void;
}

const useWalletModal = (login: Login, logout: () => void, account?: string): ReturnType => {
  const [onPresentConnectModal] = useModal(<ProviderModal login={login} />);
  const [onPresentAccountModal] = useModal(<WalletModal account={account || ""} logout={logout} />);
  const [onPresentChainModal] = useModal(<ChainModal />);
  return { onPresentConnectModal, onPresentAccountModal, onPresentChainModal };
};

export default useWalletModal;
