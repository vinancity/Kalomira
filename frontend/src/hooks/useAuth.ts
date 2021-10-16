import { useCallback } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { NoBscProviderError as NoKaiProviderError } from "@becoswap-libs/kai-connector";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from "@web3-react/walletconnect-connector";
import { ConnectorNames } from "utils/walletTypes";
import { connectorsByName } from "utils/web3React";
import { useAppDispatch } from "state";

const useAuth = () => {
  const dispath = useAppDispatch();
  const { activate, deactivate } = useWeb3React();

  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID];
    if (connector) {
      activate(connector, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          console.error("Unsupported chain", error);
        } else {
          console.error("other error");
        }
      });
    } else {
      console.error("Invalid connector");
    }
  }, []);

  const logout = useCallback(() => {
    deactivate();
  }, []);

  return { login, logout };
};

export default useAuth;
