export interface Address {
	31337?: string; // local testnet
	0?: string;
}

export interface Token {
	symbol: string;
	address?: Address;
	decimals?: number;
	projectlink?: string;
}
