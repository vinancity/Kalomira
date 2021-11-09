import { useCallback } from "react";
import { useMasterchef } from "hooks/useContract";
import { DEFAULT_GAS_LIMIT } from "config";

const useStakeFarms = (pid: number) => {
  const masterChefContract = useMasterchef();

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await masterChefContract.deposit(pid, amount, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
      console.info(txHash);
    },
    [masterChefContract, pid]
  );

  return { onStake: handleStake };
};

export default useStakeFarms;
