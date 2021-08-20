import { useCallback } from "react";
import { getRateFromDeposit } from "utils/calls";
import { useIbKAI } from "hooks/useContract";

const useGetMintRate = () => {
	const ibKaiContract = useIbKAI();

	const handleGetMintRate = useCallback(
		async (amount: string) => {
			try {
				const mintRate = await getRateFromDeposit(ibKaiContract, amount);
				return mintRate;
			} catch (e) {
				console.error("GetMintRate", e);
			}
		},
		[ibKaiContract]
	);

	return { onGetMintRate: handleGetMintRate };
};

export default useGetMintRate;
