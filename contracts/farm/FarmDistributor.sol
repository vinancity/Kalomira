pragma solidity >0.8.0;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import 'hardhat/console.sol';
import '../protocol/distributor/IDistributor.sol';
import '../protocol/address/WithAddressProvider.sol';
import '../token/IWrappedToken.sol';
import './Masterchef.sol';
import './IMasterChef.sol';

contract FarmDistributorState {
  address _WKAIContract;
  address _rewardToken;
  address _masterchef;
  uint256 _poolID;
}

contract FarmDistributor is IDistributor, FarmDistributorState, WithAddressProvider, OwnableUpgradeable {
  function initialize(address addressProvider_) external initializer {
    OwnableUpgradeable.__Ownable_init();
    _setAddressProvider(addressProvider_);
    _WKAIContract = 0xAF984E23EAA3E7967F3C5E007fbe397D8566D23d; // mainnet WKAI | testnet: 0x4C0b3a14E6Cdd45Aac3d287969336EA7a765d20a
    _rewardToken = 0x2Eddba8b949048861d2272068A94792275A51658; // mainnet BecoSwap Token
    _masterchef = 0x20e8Ff1e1d9BC429489dA76B1Fc20A9BFbF3ee7e; // mainnet BecoSwap Masterchef
    _poolID = 1; // mainnet WKAI pool id = 1
  }

  /**
   * @dev to receive KAI back from WKAI
   */
  receive() external payable {}

  /**
   * @dev Throws error if sender is not DistributorFactory contract
   */
  modifier onlyFactory() {
    address distributorFactory = IAddressProvider(_addressProvider).getDistributor();
    require(msg.sender == distributorFactory, 'sender is not Distributor');
    _;
  }

  /**
   * @dev Factory deposits KAI into this contract for later use
   */
  function deposit(uint256 amount) public payable override onlyFactory {
    require(msg.value == amount, 'Amount does not match msg value');
  }

  /**
   * @dev Factory recalls KAI amount
   */
  function withdraw(uint256 amount) public override onlyFactory {
    require(address(this).balance >= amount, 'Insufficient balance');
    _sendValue(msg.sender, amount);
  }

  /**
   * @dev Harvest rewards from benefit contract
   */
  function harvest() external override {
    // deposit 0 into masterchef pool
    IMasterChef(_masterchef).deposit(_poolID, 0);
  }

  /**
   * @dev Delegate KAI (WKAI in this case) to Kardia staking contract or some lending/farming pool
   */
  function delegate(uint256 amount) external override {
    address distributorFactory = IAddressProvider(_addressProvider).getDistributor();
    require(msg.sender == distributorFactory, 'sender is not Distributor');
    require(address(this).balance >= amount, 'Insufficient balance');
    _wrapKAI(amount);
    IMasterChef(_masterchef).deposit(_poolID, amount);
  }

  /**
   * @dev Undelegate the asset from the contract
   */
  function undelegate(uint256 amount) external override {
    address distributorFactory = IAddressProvider(_addressProvider).getDistributor();
    require(msg.sender == distributorFactory, 'sender is not Distributor');
    IMasterChef(_masterchef).withdraw(_poolID, amount);
    _unwrapKAI(amount);
  }

  /**
   * @dev Indicator between locked or unlocked distributor
   */
  function isLocked() external pure override returns (bool) {
    return false;
  }

  function _wrapKAI(uint256 amount) internal {
    IWrappedtoken(_WKAIContract).deposit{ value: amount }();
  }

  function _unwrapKAI(uint256 amount) internal {
    IWrappedtoken(_WKAIContract).withdraw(amount);
  }

  function _setWKAIContract(address newAddr) public onlyOwner {
    require(newAddr != address(0), 'ZERO ADDRESS');
    _WKAIContract = newAddr;
  }

  /**
   * @dev set the reward token address so we can transfer rewards out of contract
   */
  function _setRewardTokenAddress(address newAddr) public onlyOwner {
    require(newAddr != address(0), 'ZERO ADDRESS');
    _rewardToken = newAddr;
  }

  function _setMasterchef(address newAddr) public onlyOwner {
    require(newAddr != address(0), 'ZERO ADDRESS');
    _masterchef = newAddr;
    IWrappedtoken(_WKAIContract).approve(_masterchef, type(uint256).max);
  }

  function _setPoolID(uint256 pid) public onlyOwner {
    _poolID = pid;
  }

  /**
   * @dev transfers all of the rewards token to owner
   */
  function _extractRewards() public onlyOwner {
    require(msg.sender == owner(), 'ZERO ADDRESS');
    uint256 balance = IERC20(_rewardToken).balanceOf(address(this));
    IERC20(_rewardToken).transfer(owner(), balance);
  }

  function _sendValue(address recipient, uint256 amount) internal {
    require(address(this).balance >= amount, 'Address: insufficient balance');

    (bool success, ) = recipient.call{ value: amount }('');
    require(success, 'Address: unable to send value, recipient may have reverted');
  }
}
