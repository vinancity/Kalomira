import { useMemo } from "react";
import useWeb3 from "./useWeb3";
import { getIbKaiContract, getKaloContract, getMasterchefContract, getErc20Contract } from "utils/contractHelpers";

import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { simpleRpcProvider } from "utils/providers";

export const useIbKAI = () => {
  const { library } = useWeb3();
  return useMemo(() => getIbKaiContract(library.getSigner()), [library]);
};

export const useKalo = () => {
  const { library } = useWeb3();
  return useMemo(() => getKaloContract(library.getSigner()), [library]);
};

export const useMasterchef = () => {
  const { library } = useWeb3();
  return useMemo(() => getMasterchefContract(library.getSigner()), [library]);
};

export const useERC20 = (address: string) => {
  const { library } = useWeb3();
  return useMemo(() => getErc20Contract(address, library.getSigner()), [library]);
};
