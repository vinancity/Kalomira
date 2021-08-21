import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { getDecimalAmount } from "utils/formatBalance";
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from "config";
import MintAndRedeem from "views/MintAndRedeem";

const options = { gasLimit: DEFAULT_GAS_LIMIT };

// Returns a BigNumber of mintAmount, throws error if too many decimals or >18 digits after decimal
export const getMintAmount = async (ibKaiContract, amount) => {
	const depositAmount = new BigNumber(amount)
		.times(DEFAULT_TOKEN_DECIMAL)
		.toString();
	const mintAmount = await ibKaiContract.getMintAmount(depositAmount);
	return new BigNumber(mintAmount);
};

export const getRedeemAmount = async (ibKaiContract, amount) => {
	const returnAmount = new BigNumber(amount)
		.times(DEFAULT_TOKEN_DECIMAL)
		.toString();
	const redeemAmount = await ibKaiContract.getKAIRedeemAmount(returnAmount);
	return new BigNumber(redeemAmount);
};

// Returns a BigNumber of mint rate, throws error if too many decimals or >18 digits after decimal
export const getRateFromDeposit = async (ibKaiContract, amount) => {
	const depositAmount = new BigNumber(amount)
		.times(DEFAULT_TOKEN_DECIMAL)
		.toString();

	const mintRate = await ibKaiContract.getRateFromDeposit(depositAmount);
	return new BigNumber(mintRate);
};

export const getRateFromWithdraw = async (ibKaiContract, amount) => {
	const returnAmount = new BigNumber(amount)
		.times(DEFAULT_TOKEN_DECIMAL)
		.toString();
	const redeemRate = await ibKaiContract.getRateFromWithdraw(returnAmount);
	return new BigNumber(redeemRate);
};

export const mintIbKAI = async (ibKaiContract, amount) => {
	const depositAmount = new BigNumber(amount)
		.times(DEFAULT_TOKEN_DECIMAL)
		.toString(16); //Convert to hexidecimal string
	console.log(depositAmount, 1000000000000000);
	// if amount is 0, they are dumb
	const tx = await ibKaiContract.deposit({ value: "0x" + depositAmount });
	const receipt = await tx.wait();
	return receipt.status;
};

export const redeemKAI = async (ibKaiContract, amount) => {
	const returnAmount = new BigNumber(amount)
		.times(DEFAULT_TOKEN_DECIMAL)
		.toString();

	const tx = await ibKaiContract.withdraw(returnAmount);
	const receipt = await tx.wait();
	return receipt.status;
};
