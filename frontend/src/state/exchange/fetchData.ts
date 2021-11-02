import multicall from "utils/multicall";
import erc20ABI from "config/abi/erc20.json";
import { getIbKAIAddress, getFactoryAddress } from "utils/addressHelpers";

export const fetchAllowance = async (account: string) => {
  const ibKaiAddress = getIbKAIAddress();
  const factoryAddress = getFactoryAddress();
  const allowance = await multicall(erc20ABI, [
    { address: ibKaiAddress, name: "allowance", params: [account, factoryAddress] },
  ]);
  return allowance.toString();
};
