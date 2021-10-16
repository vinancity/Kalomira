// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDistributor {
  /**
   * @dev Deposit KAI to benefit contract
   */
  function deposit(uint256 amount) external payable;

  /**
   * @dev Withdraw KAI from benefit contract
   */
  function withdraw(uint256 amount) external;

  /**
   * @dev Harvest rewards from benefit contract
   */
  function harvest() external;

  /**
   * @dev Delegate KAI to Kardia staking contract or some lending/farming pool
   */
  function delegate(uint256 amount) external;

  /**
   * @dev Undelegate the asset from the contract
   */
  function undelegate(uint256 amount) external;

  /**
   * @dev Indicator between locked or unlocked distributor
   */
  function isLocked() external view returns (bool);
}
