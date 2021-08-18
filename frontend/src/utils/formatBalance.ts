import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { BIG_TEN } from "./bigNumber";

/**
 * Take a formatted amount, e.g. 15 ETH and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount: BigNumber, decimals = 18) => {
	return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
	return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
};

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
	return getBalanceAmount(balance, decimals).toNumber();
};

export const getFullDisplayBalance = (
	balance: BigNumber,
	decimals = 18,
	displayDecimals?: number
) => {
	return getBalanceAmount(balance, decimals).toFixed(displayDecimals);
};
