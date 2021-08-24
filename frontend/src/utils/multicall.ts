import { ethers } from "ethers";
import { getMulticallContract } from "./contractHelpers";

export type MultiCallResponse<T> = T | null;

export interface Call {
	address: string; // Address of contract
	name: string; // Function name
	params?: any[]; // Function params
}

const multicall = async <T = any>(abi: any[], calls: Call[]): Promise<T> => {
	try {
		const multi = getMulticallContract();
		const itf = new ethers.utils.Interface(abi);

		const calldata = calls.map((call) => [
			call.address.toLowerCase(),
			itf.encodeFunctionData(call.name, call.params),
		]);
		const { returnData } = await multi.aggregate(calldata);

		const res = returnData.map((call, i) =>
			itf.decodeFunctionResult(calls[i].name, call)
		);

		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export default multicall;
