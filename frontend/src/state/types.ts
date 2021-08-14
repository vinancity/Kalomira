import BigNumber from "bignumber.js";

export interface User {
	userId: number;
	nativeBalance: number;
	isActive: boolean;
}

export interface UserState {
	isInitialized: boolean;
	isLoading: boolean;
	data: User;
}
