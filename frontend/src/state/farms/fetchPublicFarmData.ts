import BigNumber from "bignumber.js";
import erc20ABI from "config/abi/erc20.json";
import masterchefABI from "config/abi/MasterChef.json";
import multicall from "utils/multicall";
import { getAddress, getMasterchefAddress } from "utils/addressHelpers";
import { BIG_ZERO, BIG_TEN } from "utils/bigNumber";
import { Farm, SerializedBigNumber } from "state/types";
import { getFullDisplayBalance } from "utils/formatBalance";

type PublicFarmData = {
  // tokenAmountMc: SerializedBigNumber
  // quoteTokenAmountMc: SerializedBigNumber
  // tokenAmountTotal: SerializedBigNumber
  // quoteTokenAmountTotal: SerializedBigNumber
  // lpTotalInQuoteToken: SerializedBigNumber
  // lpTotalSupply: SerializedBigNumber
  // tokenPriceVsQuote: SerializedBigNumber
  poolWeight: SerializedBigNumber;
  multiplier: string;
};

const fetchFarm = async (farm: Farm): Promise<PublicFarmData> => {
  const { pid, lpAddresses } = farm;
  const lpAddress = getAddress(lpAddresses);

  const [info, totalAllocPoint, kaloPerBlock] = await multicall(masterchefABI, [
    {
      address: getMasterchefAddress(),
      name: "poolInfo",
      params: [pid],
    },
    {
      address: getMasterchefAddress(),
      name: "totalAllocPoint",
    },
    {
      address: getMasterchefAddress(),
      name: "kaloPerBlock",
    },
  ]);

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO;
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO;

  return {
    poolWeight: poolWeight.toJSON(),
    multiplier: `${getFullDisplayBalance(
      allocPoint.div(new BigNumber(totalAllocPoint)).times(new BigNumber(kaloPerBlock)),
      undefined,
      1
    )}X`,
  };
};

export default fetchFarm;
