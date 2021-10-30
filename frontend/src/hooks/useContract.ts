import { useMemo } from "react";
import useWeb3 from "./useWeb3";
import {
  getAddress,
  getIbKAIAddress,
  getKaloAddress,
  getKLSAddress,
  getFactoryAddress,
  getFeeProviderAddress,
  getTreasuryAddress,
  getMasterchefAddress,
  getMulticallAddress,
} from "../utils/addressHelpers";
import {
  ERC20__factory as ERC20Factory,
  IBKAIToken__factory as ibKaiFactory,
  Kalos__factory as KalosFactory,
  KLS__factory as KLSFactory,
  Factory__factory as Factory,
  FeeProvider__factory as FeeProvider,
  Treasury__factory as TreasuryFactory,
  MasterChef__factory as MasterchefFactory,
  Multicall__factory as MulticallFactory,
} from "../typechain";

export const useERC20 = (address: string) => {
  const { library } = useWeb3();
  return useMemo(() => {
    const ERC20Contract = ERC20Factory.connect(address, library.getSigner());
    return ERC20Contract;
  }, [address, library]);
};

export const useIbKAI = () => {
  const { library } = useWeb3();
  const address = getIbKAIAddress();
  return useMemo(() => {
    console.log(library);
    const ibKaiContract = ibKaiFactory.connect(address, library.getSigner());
    return ibKaiContract;
  }, [address, library]);
};

export const useKalo = () => {
  const { library } = useWeb3();
  const address = getKaloAddress();
  return useMemo(() => {
    const kaloContract = KalosFactory.connect(address, library.getSigner());
    return kaloContract;
  }, [address, library]);
};

export const useKLS = () => {
  const { library } = useWeb3();
  const address = getKLSAddress();
  return useMemo(() => {
    const klsContract = KLSFactory.connect(address, library.getSigner());
    return klsContract;
  }, [address, library]);
};

export const useFactory = () => {
  const { library } = useWeb3();
  const address = getFactoryAddress();
  return useMemo(() => {
    const factoryContract = Factory.connect(address, library.getSigner());
    return factoryContract;
  }, [address, library]);
};

export const useFeeProvider = () => {
  const { library } = useWeb3();
  const address = getFeeProviderAddress();
  return useMemo(() => {
    const feeProviderContract = FeeProvider.connect(address, library.getSigner());
    return feeProviderContract;
  }, [address, library]);
};

export const useTreasury = () => {
  const { library } = useWeb3();
  const address = getTreasuryAddress();
  return useMemo(() => {
    const treasuryContract = TreasuryFactory.connect(address, library.getSigner());
    return treasuryContract;
  }, [address, library]);
};

export const useMulticall = () => {
  const { library } = useWeb3();
  const address = getMulticallAddress();
  return useMemo(() => {
    const multicallContract = MulticallFactory.connect(address, library.getSigner());
    return multicallContract;
  }, [address, library]);
};

// TODO: typechain this function
export const useMasterchef = () => {
  const { library } = useWeb3();
  const address = getMasterchefAddress();
  return useMemo(() => {
    const masterchefContract = MasterchefFactory.connect(address, library.getSigner());
    return masterchefContract;
  }, [address, library]);
};
