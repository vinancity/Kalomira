import { useCallback } from "react";
import { useFactory } from "hooks/useContract";
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from "config";
import BigNumber from "bignumber.js";

const useRedeemKai = () => {
  const factoryContract = useFactory();

  const handleRedeem = useCallback(
    async (amount: string) => {
      try {
        const amountBN = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
        const txHash = await factoryContract.redeem(amountBN, { gasLimit: DEFAULT_GAS_LIMIT });
        console.info(txHash);
      } catch (error) {
        console.error(error);
      }
    },
    [factoryContract]
  );

  return { onRedeem: handleRedeem };
};

export default useRedeemKai;
