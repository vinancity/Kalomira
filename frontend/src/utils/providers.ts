import { ethers } from "ethers";
import { getNodeUrl, getEthereumUrl, getKardiaUrl } from "utils/getRpcUrl";

const RPC_URL = getNodeUrl();
const ETH_URL = getEthereumUrl();
const KAI_URL = getKardiaUrl();

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
export const ethereumProvider = new ethers.providers.JsonRpcProvider(ETH_URL);
export const kardiaProvider = new ethers.providers.JsonRpcProvider(KAI_URL);

export default null;
