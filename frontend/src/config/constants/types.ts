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

export interface FarmConfig {
  pid: number;
  lpSymbol: string;
  lpAddresses: Address;
  multiplier?: string;
}
