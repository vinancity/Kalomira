import addresses from "config/constants/contracts";

import { Address } from "config/constants/types";

// returns address based on Chain ID environment variable
export const getAddress = (address: Address) => {
  const kaiMainNetChainId = 0;
  const chainId = process.env.REACT_APP_CHAIN_ID;
  return address[chainId] ? address[chainId] : address[kaiMainNetChainId];
};

export const getIbKAIAddress = () => {
  return getAddress(addresses.IBKAI_TOKEN);
};

export const getKaloAddress = () => {
  return getAddress(addresses.KALOS_TOKEN);
};

export const getKLSAddress = () => {
  return getAddress(addresses.KLS_TOKEN);
};

export const getUSDTAddress = () => {
  return getAddress(addresses.USDT_TOKEN);
};

// export const getFeeProvider = () => {
//   return getAddress(addresses.FEE_PROVIDER);
// };

export const getFactoryAddress = () => {
  return getAddress(addresses.FACTORY);
};

// export const getDistributor = () => {
//   return getAddress(addresses.DISTRIBUTOR);
// };

// export const getFarmDistributor = () => {
//   return getAddress(addresses.FARM_DISTRIBUTOR);
// };

export const getTreasuryAddress = () => {
  return getAddress(addresses.TREASURY);
};

export const getMasterchefAddress = () => {
  return getAddress(addresses.MASTER_CHEF);
};

export const getMulticallAddress = () => {
  return getAddress(addresses.MULTICALL);
};

// export const getLP1Address = () => {
//   return getAddress(addresses.MockLP1);
// };

// export const getLP2Address = () => {
//   return getAddress(addresses.MockLP2);
// };

// export const getLP3Address = () => {
//   return getAddress(addresses.MockLP3);
// };
