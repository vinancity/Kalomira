import addresses from "config/constants/contract";

import { Address } from "config/constants/types";

export const getAddress = (address: Address) => {
  const kaiMainNetChainId = 0;
  const chainId = process.env.REACT_APP_CHAIN_ID;
  return address[chainId] ? address[chainId] : address[kaiMainNetChainId];
};

export const getIbKAIAddress = () => {
  return getAddress(addresses.ibKAI);
};

export const getKaloAddress = () => {
  return getAddress(addresses.Kalomira);
};

export const getMasterchefAddress = () => {
  return getAddress(addresses.MasterChef);
};

export const getMulticallAddress = () => {
  return getAddress(addresses.Multicall);
};

export const getLP1Address = () => {
  return getAddress(addresses.MockLP1);
};

export const getLP2Address = () => {
  return getAddress(addresses.MockLP2);
};

export const getLP3Address = () => {
  return getAddress(addresses.MockLP3);
};
