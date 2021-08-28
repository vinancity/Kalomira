import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "state";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "utils/bigNumber";
import { getBalanceAmount } from "utils/formatBalance";

import useRefresh from "hooks/useRefresh";
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync, nonArchivedFarms } from ".";
import { State, Farm, FarmsState } from "../types";

export const usePollFarmsPublicData = (includeArchive = false) => {
  const dispatch = useAppDispatch();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    const farmsToFetch = nonArchivedFarms;
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid);

    dispatch(fetchFarmsPublicDataAsync(pids));
  }, [includeArchive, dispatch, slowRefresh]);
};

export const usePollFarmsWithUserData = (includeArchive = false) => {
  const dispatch = useAppDispatch();
  const { slowRefresh } = useRefresh();
  const { account } = useWeb3React();

  useEffect(() => {
    const farmsToFetch = nonArchivedFarms;
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid);

    dispatch(fetchFarmsPublicDataAsync(pids));

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }));
    }
  }, [includeArchive, dispatch, slowRefresh, account]);
};

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms);
  return farms;
};

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid));
  return farm;
};

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol));
  return farm;
};

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid);

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  };
};
