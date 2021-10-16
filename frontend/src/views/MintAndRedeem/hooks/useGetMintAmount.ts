import { useCallback } from "react";
import { getMintAmount } from "utils/calls";
import { useIbKAI } from "hooks/useContract";

const useGetMintAmount = () => {
  const ibKaiContract = useIbKAI();

  const handleGetMintAmount = useCallback(
    async (amount: string) => {
      try {
        const mintAmount = await getMintAmount(ibKaiContract, amount);
        return mintAmount;
      } catch (e) {
        console.error("GetMintAmount", e);
      }
    },
    [ibKaiContract]
  );

  return { onGetMintAmount: handleGetMintAmount };
};

export default useGetMintAmount;
