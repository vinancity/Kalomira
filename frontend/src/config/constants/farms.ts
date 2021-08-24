import { FarmConfig } from "./types";
import addresses from "./contract";

const farms: FarmConfig[] = [
	{
		pid: 0,
		lpSymbol: "ibKAI-KALO",
		lpAddresses: addresses.MockLP1,
	},
	{
		pid: 1,
		lpSymbol: "ibKAI-DOGE",
		lpAddresses: addresses.MockLP2,
	},
	{
		pid: 2,
		lpSymbol: "ibKAI-TEST",
		lpAddresses: addresses.MockLP3,
	},
];

export default farms;
