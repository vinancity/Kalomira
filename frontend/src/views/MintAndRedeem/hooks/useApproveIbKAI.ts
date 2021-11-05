import { useCallback } from "react";
import { ethers } from "ethers";
import { useIbKAI } from "hooks/useContract";
import { getFactoryAddress } from "utils/addressHelpers";
import { DEFAULT_GAS_LIMIT } from "config";

const useApproveIbKAI = () => {
  const ibKaiContract = useIbKAI();
  const factoryAddress = getFactoryAddress();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await ibKaiContract.approve(factoryAddress, ethers.constants.MaxUint256, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
      const receipt = await tx.wait();
      return receipt.status;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [ibKaiContract, factoryAddress]);

  return { onApprove: handleApprove };
};

export default useApproveIbKAI;
