// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import './IInterestBearingToken.sol';

interface IBKaiTokenInterface is IInterestBearingToken {
  /**
   * @dev Mint ibKAI from KAI
   */
  function mint(address account, uint256 amount) external payable returns (uint256);

  /**
   * @dev Burn ibKAI receive KAI
   */
  function redeem(address account, uint256 amount) external returns (uint256);

  /**
   * @dev Request for KAI for staking/farming
   * @notice Only DistributorFactory can request for fund
   */
  function requestFund(uint256 amount) external;

  /**
   * @dev Return KAI origin amount + rewards from staking/farming
   * @notice Only DistributorFactory can return for fund
   */
  function returnFund(uint256 amount) external;
}
