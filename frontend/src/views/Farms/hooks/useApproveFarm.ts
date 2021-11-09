import { useCallback } from "react";
import { ethers } from "ethers";
import { useMasterchef, useERC20 } from "hooks/useContract";
import { DEFAULT_GAS_LIMIT } from "config";

const useApproveFarm = (lpAddress: string) => {
  const masterChefContract = useMasterchef();
  const lpContract = useERC20(lpAddress);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await lpContract.approve(masterChefContract.address, ethers.constants.MaxUint256, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
      const receipt = await tx.wait();
      return receipt.status;
    } catch (e) {
      return false;
    }
  }, [lpContract, masterChefContract]);

  return { onApprove: handleApprove };
};

export default useApproveFarm;
