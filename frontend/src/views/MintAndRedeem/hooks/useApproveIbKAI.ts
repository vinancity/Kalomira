import { useCallback } from "react";
import { ethers } from "ethers";
import { useIbKAI } from "hooks/useContract";
import { getFactoryAddress } from "utils/addressHelpers";

const useApproveIbKAI = () => {
  const ibKaiContract = useIbKAI();
  const factoryAddress = getFactoryAddress();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await ibKaiContract.approve(factoryAddress, ethers.constants.MaxUint256);
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
