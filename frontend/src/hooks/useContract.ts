import { useMemo } from "react";
import useWeb3 from "./useWeb3";
import { getIbKaiContract, getKaloContract, getMasterchefContract, getErc20Contract } from "utils/contractHelpers";

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

/**
export const useTreasury = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => {
    const treasuryContract = TreasuryFactory.connect(
      address,
      (web3 as unknown) as any
    );
    return treasuryContract;
  }, [address, web3]);
};
*/
