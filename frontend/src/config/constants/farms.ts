import { FarmConfig } from "./types";
import lpAddresses from "./lpAddresses";

const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: "ibKAI-KALO",
    lpAddresses: lpAddresses.IBKAI_KALO,
  },
  {
    pid: 1,
    lpSymbol: "ibKAI-DOGE",
    lpAddresses: lpAddresses.IBKAI_DOGE,
  },
  {
    pid: 2,
    lpSymbol: "ibKAI-TEST",
    lpAddresses: lpAddresses.IBKAI_TEST,
  },
];

export default farms;
