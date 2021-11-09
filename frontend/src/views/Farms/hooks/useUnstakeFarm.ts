import { useCallback } from "react";
import { useMasterchef } from "hooks/useContract";
import { DEFAULT_GAS_LIMIT } from "config";

const useUnstakeFarms = (pid: number) => {
  const masterChefContract = useMasterchef();

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await masterChefContract.withdraw(pid, amount, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
      console.info(txHash);
    },
    [masterChefContract, pid]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstakeFarms;
