import { useMemo } from "react";
import useWeb3 from "./useWeb3";
import { getIbKaiContract, getKaloContract } from "utils/contractHelpers";

import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";

export const useIbKai = () => {
	const { library } = useWeb3();
	return useMemo(() => getIbKaiContract(library.getSigner()), [library]);
};

export const useKalo = () => {
	const { library } = useWeb3();
	return useMemo(() => getKaloContract(library.getSigner()), [library]);
};
