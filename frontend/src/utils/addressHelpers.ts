import addresses from "config/constants/contracts.json";

import { Address } from "config/constants/types";

export const getAddress = (address: string) => {
	const kaiMainNetChainId = 69;
	const chainId = process.env.REACT_APP_CHAIN_ID;
	return address[chainId] ? address[chainId] : address[kaiMainNetChainId];
};

export const getIbKAIAddress = () => {
	//return getAddress(addresses.ibKAI);
	return addresses.ibKAI;
};

export const getKaloAddress = () => {
	//return getAddress(addresses.ibKAI);
	return addresses.Kalomira;
};
