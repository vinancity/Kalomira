import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "state";
import { useWeb3React } from "@web3-react/core";
import { fetchExchangeAllowanceAsync } from ".";
import { State } from "state/types";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "utils/bigNumber";
import useRefresh from "hooks/useRefresh";

export const usePollExchangeAllowance = () => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    if (account) {
      dispatch(fetchExchangeAllowanceAsync({ account }));
    }
  }, [dispatch, slowRefresh, account]);
};

export const useExchangeAllowance = () => {
  const allowance = useSelector((state: State) => state.exchange.allowance);
  return allowance ? new BigNumber(allowance) : BIG_ZERO;
};
