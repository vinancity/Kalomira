// Formats address string to have Ox + uppercase hexstring
export const formatAddress = (address: string) => {
  return address.substring(0, 2) + address.substring(2).toUpperCase();
};

// Truncates an address, defaults to 0x1234...5678
export const truncateAddress = (address: string, startLength = 6, endLength = 4) => {
  const addr = formatAddress(address);
  return `${addr.substring(0, startLength)}...${addr.substring(addr.length - endLength)}`;
};

export default truncateAddress;
