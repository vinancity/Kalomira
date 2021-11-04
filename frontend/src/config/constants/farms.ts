import { FarmConfig } from "./types";
import addresses from "./contracts";

const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: "ibKAI-KALO",
    lpAddresses: addresses.IBKAI_TOKEN,
  },
  {
    pid: 1,
    lpSymbol: "ibKAI-DOGE",
    lpAddresses: addresses.IBKAI_TOKEN,
  },
  {
    pid: 2,
    lpSymbol: "ibKAI-TEST",
    lpAddresses: addresses.IBKAI_TOKEN,
  },
];

export default farms;
