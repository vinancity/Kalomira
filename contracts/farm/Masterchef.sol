// SPDX-License-Identifier: MIT

pragma solidity >0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

// MasterChef is holder of all supply of Kalos
// will not mint new tokens, but will transfer rewards to stakers
contract MasterChef is Ownable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;
  // Info of each user.
  struct UserInfo {
    uint256 amount; // How many LP tokens the user has provided.
    uint256 rewardDebt; // Reward debt. See explanation below.
    //
    // We do some fancy math here. Basically, any point in time, the amount of KALOs
    // entitled to a user but is pending to be distributed is:
    //
    //   pending reward = (user.amount * pool.accKaloPerShare) - user.rewardDebt
    //
    // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
    //   1. The pool's `accKaloPerShare` (and `lastRewardBlock`) gets updated.
    //   2. User receives the pending reward sent to his/her address.
    //   3. User's `amount` gets updated.
    //   4. User's `rewardDebt` gets updated.
  }
  // Info of each pool.
  struct PoolInfo {
    IERC20 lpToken; // Address of LP token contract.
    uint256 allocPoint; // How many allocation points assigned to this pool. KALOs to distribute per block.
    uint256 lastRewardBlock; // Last block number that KALOs distribution occurs.
    uint256 accKaloPerShare; // Accumulated KALOs per share, times KALO_PRECISION. See below.
  }
  // The KALO TOKEN!
  IERC20 public kalo;
  // Dev address.
  address public devaddr;
  // The block number when KALO mining starts.
  uint256 public startBlock;
  // KALO tokens created per block.
  uint256 public kaloPerBlock;
  // Block number when KALO period ends.
  uint256 public bonusEndBlock;
  // Bonus muliplier for early kalo makers.
  uint256 public constant BONUS_MULTIPLIER = 1;
  // Info of each pool.
  PoolInfo[] public poolInfo;
  // Info of each user that stakes LP tokens.
  mapping(uint256 => mapping(address => UserInfo)) public userInfo;
  // Total allocation poitns. Must be the sum of all allocation points in all pools.
  uint256 public totalAllocPoint = 0;

  uint256 private constant KALO_PRECISION = 1e12;

  event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
  event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
  event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);

  constructor(
    IERC20 _kalo,
    address _devaddr,
    uint256 _kaloPerBlock,
    uint256 _startBlock,
    uint256 _bonusEndBlock
  ) {
    kalo = _kalo;
    devaddr = _devaddr;
    kaloPerBlock = _kaloPerBlock;
    startBlock = _startBlock;
    bonusEndBlock = _bonusEndBlock;
  }

  // to change rewards per block, will affect staker rewards if still staking. EMERGENCY ONLY
  function setKaloPerBlock(uint256 amountPerBlock) public onlyOwner {
    require(amountPerBlock > 0, 'Amount must be greater than 0.');
    kaloPerBlock = amountPerBlock;
  }

  function poolLength() external view returns (uint256) {
    return poolInfo.length;
  }

  // Add a new lp to the pool. Can only be called by the owner.
  // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
  function add(
    uint256 _allocPoint,
    IERC20 _lpToken,
    bool _withUpdate
  ) public onlyOwner {
    if (_withUpdate) {
      massUpdatePools();
    }
    uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
    totalAllocPoint = totalAllocPoint.add(_allocPoint);
    poolInfo.push(
      PoolInfo({ lpToken: _lpToken, allocPoint: _allocPoint, lastRewardBlock: lastRewardBlock, accKaloPerShare: 0 })
    );
  }

  // Update the given pool's KALO allocation point. Can only be called by the owner.
  function set(
    uint256 _pid,
    uint256 _allocPoint,
    bool _withUpdate
  ) public onlyOwner {
    if (_withUpdate) {
      massUpdatePools();
    }
    totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
    poolInfo[_pid].allocPoint = _allocPoint;
  }

  // Return reward multiplier over the given _from to _to block.
  function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
    if (_to <= bonusEndBlock) {
      return _to.sub(_from).mul(BONUS_MULTIPLIER);
    } else if (_from >= bonusEndBlock) {
      return _to.sub(_from);
    } else {
      return bonusEndBlock.sub(_from).mul(BONUS_MULTIPLIER).add(_to.sub(bonusEndBlock));
    }
  }

  // View function to see pending KALOs on frontend.
  function pendingKalo(uint256 _pid, address _user) external view returns (uint256) {
    PoolInfo storage pool = poolInfo[_pid];
    UserInfo storage user = userInfo[_pid][_user];
    uint256 accKaloPerShare = pool.accKaloPerShare;
    uint256 lpSupply = pool.lpToken.balanceOf(address(this));
    if (block.number > pool.lastRewardBlock && lpSupply != 0) {
      uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
      uint256 kaloReward = multiplier.mul(kaloPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
      accKaloPerShare = accKaloPerShare.add(kaloReward.mul(KALO_PRECISION).div(lpSupply));
    }
    return user.amount.mul(accKaloPerShare).div(KALO_PRECISION).sub(user.rewardDebt);
  }

  // Update reward vairables for all pools. Be careful of gas spending!
  function massUpdatePools() public {
    uint256 length = poolInfo.length;
    for (uint256 pid = 0; pid < length; ++pid) {
      updatePool(pid);
    }
  }

  // Update reward variables of the given pool to be up-to-date.
  function updatePool(uint256 _pid) public {
    PoolInfo storage pool = poolInfo[_pid];
    if (block.number <= pool.lastRewardBlock) {
      return;
    }
    uint256 lpSupply = pool.lpToken.balanceOf(address(this));
    if (lpSupply == 0) {
      pool.lastRewardBlock = block.number;
      return;
    }
    uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
    uint256 kaloReward = multiplier.mul(kaloPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
    // kalo.transfer(address(this), kaloReward);
    pool.accKaloPerShare = pool.accKaloPerShare.add(kaloReward.mul(KALO_PRECISION).div(lpSupply));
    pool.lastRewardBlock = block.number;
  }

  // Deposit LP tokens to MasterChef for KALO allocation.
  function deposit(uint256 _pid, uint256 _amount) public {
    PoolInfo storage pool = poolInfo[_pid];
    UserInfo storage user = userInfo[_pid][msg.sender];
    updatePool(_pid);
    if (user.amount > 0) {
      uint256 pending = user.amount.mul(pool.accKaloPerShare).div(KALO_PRECISION).sub(user.rewardDebt);
      safeKaloTransfer(msg.sender, pending);
    }
    pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
    user.amount = user.amount.add(_amount);
    user.rewardDebt = user.amount.mul(pool.accKaloPerShare).div(KALO_PRECISION);
    emit Deposit(msg.sender, _pid, _amount);
  }

  // Withdraw LP tokens from MasterChef.
  function withdraw(uint256 _pid, uint256 _amount) public {
    PoolInfo storage pool = poolInfo[_pid];
    UserInfo storage user = userInfo[_pid][msg.sender];
    require(user.amount >= _amount, 'withdraw: not good');
    updatePool(_pid);
    uint256 pending = user.amount.mul(pool.accKaloPerShare).div(KALO_PRECISION).sub(user.rewardDebt);
    safeKaloTransfer(msg.sender, pending);
    user.amount = user.amount.sub(_amount);
    user.rewardDebt = user.amount.mul(pool.accKaloPerShare).div(KALO_PRECISION);
    pool.lpToken.safeTransfer(address(msg.sender), _amount);
    emit Withdraw(msg.sender, _pid, _amount);
  }

  // Withdraw without caring about rewards. EMERGENCY ONLY.
  function emergencyWithdraw(uint256 _pid) public {
    PoolInfo storage pool = poolInfo[_pid];
    UserInfo storage user = userInfo[_pid][msg.sender];
    pool.lpToken.safeTransfer(address(msg.sender), user.amount);
    emit EmergencyWithdraw(msg.sender, _pid, user.amount);
    user.amount = 0;
    user.rewardDebt = 0;
  }

  // Safe kalo transfer function, just in case if rounding error causes pool to not have enough KALOs.
  function safeKaloTransfer(address _to, uint256 _amount) internal {
    uint256 kaloBal = kalo.balanceOf(address(this));
    if (_amount > kaloBal) {
      kalo.transfer(_to, kaloBal);
    } else {
      kalo.transfer(_to, _amount);
    }
  }

  // Update dev address by the previous dev. (address to )
  function setDev(address _devaddr) public onlyOwner {
    require(devaddr != address(0), 'setDev: ZERO ADDRESS');
    devaddr = _devaddr;
  }
}
