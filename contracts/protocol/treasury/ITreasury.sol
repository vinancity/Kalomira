// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface ITreasury {
  /**
   * @dev Receive the ibKAI fee from FeeProvider and should do the swap to other token such as USDT or KAI if needed
   * Only allow to claim rewards at the end of each week
   */
  function takeFee(uint256 amount) external;

  /**
   * @dev Claim USDT rewards after snapshot occurs
   */
  function claimKLSRewards(uint256 weekNumber) external;

  function stake(uint256 chefId, uint256 amount) external;

  function unstake(uint256 chefId, uint256 amount) external;

  function claim(uint256 chefId) external;
}
