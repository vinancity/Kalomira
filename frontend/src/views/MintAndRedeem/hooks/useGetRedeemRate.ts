import { useCallback } from "react";
import { getRateFromWithdraw } from "utils/calls";
import { useIbKAI } from "hooks/useContract";

const useGetRedeemRate = () => {
  const ibKaiContract = useIbKAI();

  const handleGetRedeemRate = useCallback(
    async (amount: string) => {
      try {
        const redeemRate = await getRateFromWithdraw(ibKaiContract, amount);
        return redeemRate;
      } catch (e) {
        console.error("GetRedeemRate", e);
      }
    },
    [ibKaiContract]
  );

  return { onGetRedeemRate: handleGetRedeemRate };
};

export default useGetRedeemRate;
