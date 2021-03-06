import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { BIG_ZERO } from "utils/bigNumber";
import { simpleRpcProvider, kardiaProvider } from "utils/providers";
import { useIbKAI, useERC20, useKLS } from "./useContract";
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
  const ERC20Contract = useERC20(tokenAddress);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const result = await ERC20Contract.balanceOf(account);
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
  }, [account, tokenAddress, fastRefresh, ERC20Contract, SUCCESS, FAILED]);

  return balanceState;
};

// TODO: retrieve weekly balance
export const useKLSBalance = () => {
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED);
  const [klsBalance, setBalance] = useState(BIG_ZERO);
  const { account } = useWeb3React();
  const { slowRefresh } = useRefresh();
  const { lastUpdated, setLastUpdated } = useLastUpdated();
  const klsContract = useKLS();

  useEffect(() => {
    const fetchKLSBalance = async () => {
      try {
        const klsBalance = await klsContract.balanceOf_(account);
        setBalance(new BigNumber(klsBalance.toString()));
        setFetchStatus(FetchStatus.SUCCESS);
      } catch (error) {
        console.error(error);
        setFetchStatus(FetchStatus.FAILED);
      }
    };

    if (account) {
      fetchKLSBalance();
    }
  }, [account, lastUpdated, slowRefresh, klsContract, setBalance, setFetchStatus]);

  return { klsBalance, fetchStatus, refresh: setLastUpdated };
};

export const useIbKaiBalance = () => {
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED);
  const [ibKaiBalance, setBalance] = useState(BIG_ZERO);
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();
  const { lastUpdated, setLastUpdated } = useLastUpdated();
  const ibKaiContract = useIbKAI();

  useEffect(() => {
    const fetchIbKAIBalance = async () => {
      try {
        const ibKAIBalance = await ibKaiContract.balanceOf(account);
        setBalance(new BigNumber(ibKAIBalance.toString()));
        setFetchStatus(FetchStatus.SUCCESS);
      } catch (error) {
        console.error(error);
        setFetchStatus(FetchStatus.FAILED);
      }
    };

    if (account) {
      fetchIbKAIBalance();
    }
  }, [account, lastUpdated, fastRefresh, ibKaiContract, setBalance, setFetchStatus]);

  return { ibKaiBalance, fetchStatus, refresh: setLastUpdated };
};

export const useNativeBalance = () => {
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED);
  const [balance, setBalance] = useState(BIG_ZERO);
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();
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
  }, [account, lastUpdated, fastRefresh, setBalance, setFetchStatus]);

  return { balance, fetchStatus, refresh: setLastUpdated };
};

export default useTokenBalance;
