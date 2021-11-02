import BigNumber from "bignumber.js";
import { FarmConfig } from "config/constants/types";

export type SerializedBigNumber = string;

export interface Farm extends FarmConfig {
  // tokenAmountMc?: SerializedBigNumber;
  // quoteTokenAmountMc?: SerializedBigNumber;
  // tokenAmountTotal?: SerializedBigNumber;
  // quoteTokenAmountTotal?: SerializedBigNumber;
  // lpTotalInQuoteToken?: SerializedBigNumber;
  // lpTotalSupply?: SerializedBigNumber;
  // tokenPriceVsQuote?: SerializedBigNumber;
  poolWeight?: SerializedBigNumber;
  userData?: {
    allowance: string;
    tokenBalance: string;
    stakedBalance: string;
    earnings: string;
  };
}

export interface FarmsState {
  data: Farm[];
  loadArchivedFarmsData: boolean;
  userDataLoaded: boolean;
}

export interface ExchangeState {
  allowance: string;
}

export interface State {
  connector: any;
  farms: FarmsState;
  exchange: ExchangeState;
}
