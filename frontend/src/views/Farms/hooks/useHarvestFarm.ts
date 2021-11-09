import { useCallback } from "react";
import { useMasterchef } from "hooks/useContract";
import { DEFAULT_GAS_LIMIT } from "config";

const useHarvestFarm = (farmPid: number) => {
  const masterChefContract = useMasterchef();

  const handleHarvest = useCallback(async () => {
    await masterChefContract.deposit(farmPid, 0, {
      gasLimit: DEFAULT_GAS_LIMIT,
    });
  }, [farmPid, masterChefContract]);

  return { onReward: handleHarvest };
};

export default useHarvestFarm;
