import { useCallback } from "react";
import { useFactory } from "hooks/useContract";
import { DEFAULT_TOKEN_DECIMAL } from "config";
import BigNumber from "bignumber.js";

const useGetRedeemAmount = () => {
  const factoryContract = useFactory();

  const handleGetRedeemAmount = useCallback(
    async (amount: string) => {
      try {
        if (amount === "") amount = "0";
        const amountBN = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
        const mintAmount = await factoryContract.getInputAmount(amountBN);
        return new BigNumber(mintAmount.toString());
      } catch (e) {
        console.error("GetRedeemAmount", e);
        return new BigNumber(0);
      }
    },
    [factoryContract]
  );

  return { onGetRedeemAmount: handleGetRedeemAmount };
};

export default useGetRedeemAmount;
