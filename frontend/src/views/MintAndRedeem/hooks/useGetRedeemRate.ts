import { useState, useEffect } from "react";
import { useFeeProvider } from "hooks/useContract";
import { BIG_ZERO } from "utils/bigNumber";
import BigNumber from "bignumber.js";

enum FetchStatus {
  NOT_FETCHED = "not-fetched",
  SUCCESS = "success",
  FAILED = "failed",
}

const useGetRedeemRate = () => {
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED);
  const [redeemRate, setRedeemRate] = useState(BIG_ZERO);
  const [redeemPct, setRedeemPct] = useState(BIG_ZERO);
  const feeProviderContract = useFeeProvider();

  useEffect(() => {
    const fetchMintRate = async () => {
      try {
        const rate = new BigNumber((await feeProviderContract.redeemFee()).toString());
        const basisPoint = new BigNumber((await feeProviderContract.basisPoint()).toString());
        const redeemRate = rate.dividedBy(basisPoint);
        setFetchStatus(FetchStatus.SUCCESS);
        setRedeemRate(redeemRate); // decimal rate
        setRedeemPct(redeemRate.times(new BigNumber(100))); // percent rate
      } catch (error) {
        console.error("GetMintRate", error);
        setFetchStatus(FetchStatus.FAILED);
      }
    };

    fetchMintRate();
  }, [feeProviderContract, setRedeemRate, setFetchStatus]);

  return { fetchStatus, redeemRate, redeemPct };
};

export default useGetRedeemRate;
