import { useCallback } from "react";
import { useFactory } from "hooks/useContract";
import { DEFAULT_TOKEN_DECIMAL } from "config";
import BigNumber from "bignumber.js";

const useGetMintOutput = () => {
  const factoryContract = useFactory();

  const handleGetMintOutput = useCallback(
    async (amount: string) => {
      try {
        if (amount === "") amount = "0";
        const amountBN = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
        const mintAmount = await factoryContract.getOutputAmount(amountBN);
        return new BigNumber(mintAmount.toString());
      } catch (e) {
        console.error("GetMintAmount", e);
      }
    },
    [factoryContract]
  );

  return { onGetMintOutput: handleGetMintOutput };
};

export default useGetMintOutput;
