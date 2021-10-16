import { useCallback } from "react";
import { redeemKAI } from "utils/calls";
import { useIbKAI } from "hooks/useContract";

const useRedeemKai = () => {
  const ibKaiContract = useIbKAI();

  const handleRedeem = useCallback(
    async (amount: string) => {
      const txHash = await redeemKAI(ibKaiContract, amount);
      console.info(txHash);
    },
    [ibKaiContract]
  );

  return { onRedeem: handleRedeem };
};

export default useRedeemKai;
