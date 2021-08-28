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
import kalomiraAbi from "config/abi/Kalomira.json";
import ibKaiAbi from "config/abi/ibKAI.json";
import lpTokenAbi from "config/abi/MockLP.json";
import MasterChefAbi from "config/abi/MasterChef.json";
import MulticallAbi from "config/abi/Multicall.json";

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getErc20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(erc20Abi, address, signer);
};

export const getIbKaiContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(ibKaiAbi, getIbKAIAddress(), signer);
};

export const getKaloContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(kalomiraAbi, getKaloAddress(), signer);
};

export const getMasterchefContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MasterChefAbi, getMasterchefAddress(), signer);
};

export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MulticallAbi, getMulticallAddress(), signer);
};
