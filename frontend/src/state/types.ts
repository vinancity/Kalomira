import BigNumber from "bignumber.js";

export interface Profile {
	userId: number;
	isActive: boolean;
	username: string;
	hasRegistered: boolean;
}

export interface ProfileState {
	isInitialized: boolean;
	isLoading: boolean;
	hasRegistered: boolean;
	data: Profile;
}
