import { ethers } from "ethers";
import { simpleRpcProvider } from "./providers";

import {
  getAddress,
  getIbKAIAddress,
  getKaloAddress,
  getMasterchefAddress,
  getMulticallAddress,
} from "./addressHelpers";

import erc20Abi from "config/abi/erc20.json";
import MasterChefAbi from "config/abi/MasterChef.json";
import MulticallAbi from "config/abi/Multicall.json";

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getErc20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(erc20Abi, address, signer);
};

export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MulticallAbi, getMulticallAddress(), signer);
};
