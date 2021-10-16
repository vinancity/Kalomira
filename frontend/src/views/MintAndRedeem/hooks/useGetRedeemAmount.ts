import { useCallback } from "react";
import { getRedeemAmount } from "utils/calls";
import { useIbKAI } from "hooks/useContract";

const useGetRedeemAmount = () => {
  const ibKaiContract = useIbKAI();

  const handleGetRedeemAmount = useCallback(
    async (amount: string) => {
      try {
        const redeemAmount = await getRedeemAmount(ibKaiContract, amount);
        return redeemAmount;
      } catch (e) {
        console.error("GetRedeemAmount", e);
      }
    },
    [ibKaiContract]
  );

  return { onGetRedeemAmount: handleGetRedeemAmount };
};

export default useGetRedeemAmount;
