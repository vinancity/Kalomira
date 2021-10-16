// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface IKLS {
  function snapshot() external returns (uint256);

  function currentSnapshot() external view returns (uint256);

  function mint(address account, uint256 amount) external;
}
