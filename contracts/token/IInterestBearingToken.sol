// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface IInterestBearingToken {
  function accrue() external;

  function getMintAmount(uint256 amount) external view returns (uint256);

  function getRedeemAmount(uint256 ibKaiAmount) external view returns (uint256);

  // function getUnderlyingAmount() external view returns (uint256);
}
