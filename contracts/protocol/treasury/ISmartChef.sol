pragma solidity >0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface ISmartChef {
  function initialize(
    IERC20 _stakedToken,
    IERC20 _rewardToken,
    uint256 _rewardPerBlock,
    uint256 _startBlock,
    uint256 _bonusEndBlock,
    uint256 _poolLimitPerUser,
    address _admin
  ) external;

  function _stakedToken() external view returns (address);

  function _rewardToken() external view returns (address);

  function deposit(address account, uint256 _amount) external;

  function withdraw(address account, uint256 _amount) external;

  function emergencyWithdraw() external;

  function emergencyRewardWithdraw(uint256 _amount) external;

  function recoverWrongTokens(address _tokenAddress, uint256 _tokenAmount) external;

  function stopReward() external;

  function updatePoolLimitPerUser(bool _hasUserLimit, uint256 _poolLimitPerUser) external;

  function updateRewardPerBlock(uint256 _rewardPerBlock) external;

  function updateStartAndEndBlocks(uint256 _startBlock, uint256 _EndBlock) external;

  function pendingReward(address _user) external view returns (uint256);
}
