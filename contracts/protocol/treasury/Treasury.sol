// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol';

import 'hardhat/console.sol';
import '../treasury/ITreasury.sol';
import '../../token/IKLS.sol';
import '../treasury/SmartChefFactory.sol';
import '../treasury/ISmartChef.sol';
import '../address/WithAddressProvider.sol';

import 'hardhat/console.sol';

contract TreasuryState {
  /**
   *@dev variables to calculate KLS rewards for stakers
   */
  address USDTtoken; // USDT address for KLS rewards
  uint256[] USDTrewards; // USDT rewards week to week to calculate user reward for that week
  mapping(address => uint256) lastClaimed; // the last claimed week for each user
  uint256 constant USDT_PRECISION = 1e6; // only calculate up to 6 decimal places of USDT

  SmartChefFactory chefFactory;
  ISmartChef[] chefPool;
}

/**
 * Users stake their KALO into the treasury to earn KAI rewards
 * Users trade on KalosDex to earn KLS, and can claim weekly rewards
 */
contract Treasury is ITreasury, TreasuryState, WithAddressProvider, OwnableUpgradeable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  function initialize(address addressProvider_) external initializer {
    OwnableUpgradeable.__Ownable_init();
    _setAddressProvider(addressProvider_);
    chefFactory = new SmartChefFactory();
  }

  function takeFee(uint256 amount) public override {
    IAddressProvider addrProvider = IAddressProvider(this.addressProvider());
    IERC20(addrProvider.getIBKAIToken()).transferFrom(_msgSender(), addrProvider.getTreasury(), amount);
  }

  function newUSDTReward(uint256 amount) internal {
    USDTrewards.push(amount);
  }

  /**
   * @dev Users can claim previous weekly rewards that they missed (KLS only)
   *      User cannot claim during the week, only after the snapshot occurs
   *      Claims individual week only, but will be looped on frontend to prevent gas limit here
   */
  function claimKLSRewards(uint256 weekNumber) external override {
    require(weekNumber > lastClaimed[msg.sender], 'User already claimed that week reward'); // prevent users from double claiming
    require(weekNumber <= currentWeek(), 'This week still in progress');
    uint256 userReward = userRewardAt(weekNumber);
    safeRewardTransfer(msg.sender, userReward);
    // move lastClaimed week to specified week number, will skip any reward between so use frontend for proper collection
    lastClaimed[msg.sender] = weekNumber;
  }

  function currentWeek() public view returns (uint256) {
    address kls = IAddressProvider(_addressProvider).getKLSToken();
    return IKLS(kls).currentSnapshot() - 1;
  }

  /**
   * @dev view USDT reward on frontend for each week
   */
  function USDTrewardAt(uint256 weekNumber) public view returns (uint256) {
    require(weekNumber < USDTrewards.length, 'Invalid week number');
    return USDTrewards[weekNumber];
  }

  /**
   * @dev view rewards by week on frontend. Calculates rewards of the previous week
   */
  function userRewardAt(uint256 weekNumber) public view returns (uint256) {
    require(weekNumber < USDTrewards.length, 'Invalid week number');
    require(weekNumber > 1, 'No rewards before week 1');
    address kls = IAddressProvider(_addressProvider).getKLSToken();
    // week balance calculated as: balance of this week - balance of the last week = total KLS gained this week
    uint256 userBalance = ERC20Snapshot(kls).balanceOfAt(msg.sender, weekNumber + 1).sub(
      ERC20Snapshot(kls).balanceOfAt(msg.sender, weekNumber)
    );
    // week supply calculated as: supply of this week - supply of the last week = total KLS minted this week
    uint256 weekSupply = ERC20Snapshot(kls).totalSupplyAt(weekNumber + 1).sub(
      ERC20Snapshot(kls).totalSupplyAt(weekNumber)
    );

    uint256 rewardPerShare = (USDTrewards[weekNumber - 1].mul(USDT_PRECISION)).div(weekSupply);
    uint256 weekReward = userBalance.mul(rewardPerShare).div(USDT_PRECISION);
    return weekReward;
  }

  // send rewards, or send all remaining rewards if insufficient funds
  function safeRewardTransfer(address to, uint256 amount) internal {
    uint256 USDTbal = ERC20(USDTtoken).balanceOf(address(this));
    if (amount > USDTbal) {
      SafeERC20.safeTransfer(IERC20(USDTtoken), to, USDTbal);
    } else {
      SafeERC20.safeTransfer(IERC20(USDTtoken), to, amount);
    }
  }

  /**
   * @dev funciton used for testing (TO BE REMOVED)
   */
  function mintKLS(address account, uint256 amount) public onlyOwner {
    address kls = IAddressProvider(_addressProvider).getKLSToken();
    IKLS(kls).mint(account, amount);
  }

  /**
   * @dev snapshot KLS rewards and staking info, and add the new USDT reward for the week
   */
  function resetWeek(uint256 reward) external onlyOwner {
    // snapshot KLS of current week
    address kls = IAddressProvider(_addressProvider).getKLSToken();
    IKLS(kls).snapshot();
    newUSDTReward(reward);
  }

  function setKLSRewardToken(address rewardToken) external onlyOwner {
    require(rewardToken != address(0), 'ZERO ADDRESS');
    USDTtoken = rewardToken;
  }

  /**
   * @dev Create a SmartChef pool with variable staking token and reward token
   *      reward token balance on this contract is transferred to SmartChef to handle rewarding
   */
  function addSmartChef(
    IERC20 _stakedToken,
    IERC20 _rewardToken,
    uint256 _rewardPerBlock,
    uint256 _startBlock,
    uint256 _endBlock,
    uint256 _poolLimitPerUser
  ) public onlyOwner {
    address chef = chefFactory.deployPool(
      _stakedToken,
      _rewardToken,
      _rewardPerBlock,
      _startBlock,
      _endBlock,
      _poolLimitPerUser,
      address(this)
    );
    chefPool.push(ISmartChef(chef));
    // approve chef for max amount since this contract is middleman
    // delegatecall is disallowed on upgradeable contracts
    _stakedToken.safeApprove(chef, type(uint256).max);
    _rewardToken.safeTransfer(chef, _rewardToken.balanceOf(address(this)));
  }

  function poolLength() external view returns (uint256) {
    return chefPool.length;
  }

  /**
   * @dev Update the block rewards for SmartChef
   */
  function updateRewardPerBlock(uint256 chefId, uint256 rewardPerBlock) public onlyOwner {
    ISmartChef(chefPool[chefId]).updateRewardPerBlock(rewardPerBlock);
  }

  /**
   * @dev Change the reward start and end block
   */
  function updateStartAndEndBlocks(
    uint256 chefId,
    uint256 _startBlock,
    uint256 _endBlock
  ) public onlyOwner {
    ISmartChef(chefPool[chefId]).updateStartAndEndBlocks(_startBlock, _endBlock);
  }

  /**
   * @dev Emergency stop all rewarding for the SmartChef
   *      Can be resumed with updateStartAndEndBlocks
   */
  function stopReward(uint256 chefId) public onlyOwner {
    ISmartChef(chefPool[chefId]).stopReward();
  }

  /**
   * @dev To retreive some rewards transferred to SmartChef on initialization. Emergency only
   */
  function emergencyRewardWithdraw(uint256 chefId, uint256 amount) public onlyOwner {
    ISmartChef(chefPool[chefId]).emergencyRewardWithdraw(amount);
  }

  /**
   * @dev To view pending reward amount for user
   */
  function pendingReward(uint256 chefId) external view returns (uint256) {
    return chefPool[chefId].pendingReward(msg.sender);
  }

  /**
   * @dev Stake LP token into pool
   */
  function stake(uint256 chefId, uint256 amount) public override {
    IERC20(ISmartChef(chefPool[chefId])._stakedToken()).safeTransferFrom(msg.sender, address(this), amount);
    ISmartChef(chefPool[chefId]).deposit(msg.sender, amount);
  }

  /**
   * @dev Untake LP token into pool
   */
  function unstake(uint256 chefId, uint256 amount) public override {
    ISmartChef(chefPool[chefId]).withdraw(msg.sender, amount);
  }

  /**
   * @dev Claim rewards from pool
   */
  function claim(uint256 chefId) public override {
    ISmartChef(chefPool[chefId]).deposit(msg.sender, 0);
  }
}
