import { useState, useEffect } from "react";
import { useFeeProvider } from "hooks/useContract";
import { BIG_ZERO } from "utils/bigNumber";
import BigNumber from "bignumber.js";

enum FetchStatus {
  NOT_FETCHED = "not-fetched",
  SUCCESS = "success",
  FAILED = "failed",
}

const useGetMintRate = () => {
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED);
  const [mintRate, setMintRate] = useState(BIG_ZERO);
  const [mintPct, setMintPct] = useState(BIG_ZERO);
  const feeProviderContract = useFeeProvider();

  useEffect(() => {
    const fetchMintRate = async () => {
      try {
        const rate = new BigNumber((await feeProviderContract.mintFee()).toString());
        const basisPoint = new BigNumber((await feeProviderContract.basisPoint()).toString());
        const mintRate = rate.dividedBy(basisPoint);
        setFetchStatus(FetchStatus.SUCCESS);
        setMintRate(mintRate); // decimal rate
        setMintPct(mintRate.times(new BigNumber(100))); // percent rate
      } catch (error) {
        console.error("GetMintRate", error);
        setFetchStatus(FetchStatus.FAILED);
      }
    };

    fetchMintRate();
  }, [feeProviderContract, setMintRate, setFetchStatus]);

  return { fetchStatus, mintRate, mintPct };
};

export default useGetMintRate;
