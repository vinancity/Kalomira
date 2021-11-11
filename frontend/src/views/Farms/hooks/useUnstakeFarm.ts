import { useCallback } from "react";
import { useMasterchef } from "hooks/useContract";
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from "config";
import BigNumber from "bignumber.js";

const useUnstakeFarms = (pid: number) => {
  const masterChefContract = useMasterchef();

  const handleUnstake = useCallback(
    async (amount: string) => {
      if (amount === "") amount = "0";
      const amountBN = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
      const txHash = await masterChefContract.withdraw(pid, amountBN, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
      console.info(txHash);
    },
    [masterChefContract, pid]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstakeFarms;
