import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { BIG_ZERO } from "utils/bigNumber";
import { simpleRpcProvider } from "utils/providers";
import { getErc20Contract, getIbKaiContract } from "utils/contractHelpers";
import useRefresh from "./useRefresh";
import useLastUpdated from "./useLastUpdated";

export type UseTokenBalanceState = {
	balance: BigNumber;
	fetchStatus: FetchStatus;
};

export enum FetchStatus {
	NOT_FETCHED = "not-fetched",
	SUCCESS = "success",
	FAILED = "failed",
}

export const useTokenBalance = (tokenAddress: string) => {
	const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus;
	const [balanceState, setBalanceState] = useState<UseTokenBalanceState>({
		balance: BIG_ZERO,
		fetchStatus: NOT_FETCHED,
	});
	const { account } = useWeb3React();
	const { fastRefresh } = useRefresh();

	useEffect(() => {
		const fetchBalance = async () => {
			const contract = getErc20Contract(tokenAddress);
			try {
				const result = await contract.balanceOf(account);
				setBalanceState({
					balance: new BigNumber(result.toString()),
					fetchStatus: SUCCESS,
				});
			} catch (error) {
				console.error(error);
				setBalanceState((prev) => ({ ...prev, fetchStatus: FAILED }));
			}
		};

		if (account) {
			fetchBalance();
		}
	}, [account, tokenAddress, fastRefresh, SUCCESS, FAILED]);
};

export const useNativeBalance = () => {
	const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED);
	const [balance, setBalance] = useState(BIG_ZERO);
	const { account } = useWeb3React();
	const { lastUpdated, setLastUpdated } = useLastUpdated();

	useEffect(() => {
		const fetchBalance = async () => {
			try {
				const nativeBalance = await simpleRpcProvider.getBalance(account);
				setBalance(new BigNumber(nativeBalance.toString()));
				setFetchStatus(FetchStatus.SUCCESS);
			} catch (error) {
				console.error(error);
				setFetchStatus(FetchStatus.FAILED);
			}
		};

		if (account) {
			fetchBalance();
		}
	}, [account, lastUpdated, setBalance, setFetchStatus]);

	return { balance, fetchStatus, refresh: setLastUpdated };
};

export default useTokenBalance;
