import BigNumber from "bignumber.js";
import erc20ABI from "config/abi/erc20.json";
import masterchefABI from "config/abi/MasterChef.json";
import multicall from "utils/multicall";
import { getAddress, getMasterchefAddress } from "utils/addressHelpers";
import { BIG_ZERO, BIG_TEN } from "utils/bigNumber";
import { Farm, SerializedBigNumber } from "state/types";

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

  const [info, totalAllocPoint] = await multicall(masterchefABI, [
    {
      address: getMasterchefAddress(),
      name: "poolInfo",
      params: [pid],
    },
    {
      address: getMasterchefAddress(),
      name: "totalAllocPoint",
    },
  ]);

  const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO;
  const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO;

  return {
    poolWeight: poolWeight.toJSON(),
    multiplier: `${allocPoint.div(10).toString()}X`,
  };
};

export default fetchFarm;
