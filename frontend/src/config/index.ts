import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";

BigNumber.config({
  EXPONENTIAL_AT: 1e9,
  DECIMAL_PLACES: 80,
});

export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);
export const DEFAULT_GAS_LIMIT = 3000000;
export const DEFAULT_GAS_PRICE = 5;
