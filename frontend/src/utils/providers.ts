import { ethers } from "ethers";
import { EtherscanProvider } from "ethers/providers";
import getRpcURL from "utils/getRpcUrl";

const RPC_URL = getRpcURL();

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

export default null;
