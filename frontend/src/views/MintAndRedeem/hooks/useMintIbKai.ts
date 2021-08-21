import { useCallback } from "react";
import { mintIbKAI } from "utils/calls";
import { useIbKAI } from "hooks/useContract";

const useMintIbKai = () => {
	const ibKaiContract = useIbKAI();

	const handleMint = useCallback(
		async (amount: string) => {
			const txHash = await mintIbKAI(ibKaiContract, amount);
			console.info(txHash);
		},
		[ibKaiContract]
	);

	return { onMint: handleMint };
};

export default useMintIbKai;
