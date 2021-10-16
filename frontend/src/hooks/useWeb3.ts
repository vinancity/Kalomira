import { useEffect, useState, useRef } from "react";
import { simpleRpcProvider } from "utils/providers";
import { useWeb3React } from "@web3-react/core";

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useWeb3 = () => {
  const { library, chainId, ...web3React } = useWeb3React();
  const refEth = useRef(library);
  const [provider, setprovider] = useState(library || simpleRpcProvider);

  useEffect(() => {
    if (library !== refEth.current) {
      setprovider(library || simpleRpcProvider);
      refEth.current = library;
    }
  }, [library]);

  return {
    library: provider,
    chainId: chainId ?? parseInt(process.env.REACT_APP_CHAIN_ID, 10),
    ...web3React,
  };
};

export default useWeb3;
