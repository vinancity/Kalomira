// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IFeeProvider.sol";
import "../treasury/ITreasury.sol";
import "../address/IAddressProvider.sol";
import "../address/WithAddressProvider.sol";
import "../../token/IInterestBearingToken.sol";

contract FeeProviderState {
  address _allocator;

  /**
   * @dev Minting/Redeeming fee reward to team.
   */
  address _devAddress;

  /**
   * @dev Fee accrue for KALOS staking treasury
   */
  address _treasuryAddress;

  /**
   * @dev Interest bearing token contract
   */
  address _ibKAI;

  uint256 _basisPoint;
  uint256 _mintFee;
  uint256 _redeemFee;
  uint256 _treasuryCommisionRate;

  /**
   *@dev check if necessary contracts are approved for IBKAI transactions
   */
  bool _hasApproved;
}

contract FeeProvider is IFeeProvider, FeeProviderState, WithAddressProvider, OwnableUpgradeable {
  using SafeMath for uint256;

  function initialize(address addressProvider_) external initializer {
    OwnableUpgradeable.__Ownable_init();
    _setAddressProvider(addressProvider_);
    _basisPoint = 10000; // divide fees by basis point
    _mintFee = 500; // 5%
    _redeemFee = 400; // 4%
    _treasuryCommisionRate = 8000; // 80%
    _hasApproved = false;
  }

  // Admin functions

  function setMintFee(uint256 _basisPointRatio) external onlyOwner {
    _mintFee = _basisPointRatio;
  }

  function setRedeemFee(uint256 _basisPointRatio) external onlyOwner {
    _redeemFee = _basisPointRatio;
  }

  function setTreasuryCommision(uint256 _basisPointRatio) external onlyOwner {
    _treasuryCommisionRate = _basisPointRatio;
  }

  function sendFee(uint256 amount) public override {
    ITreasury(IAddressProvider(this.addressProvider()).getTreasury()).takeFee(amount);
  }

  // Transfer user fee to this contract, then treasury will take from here
  function chargeFee(uint256 amount, bool isMint) external override returns (uint256, uint256) {
    if (!_hasApproved) {
      // approve treasury
      address token = IAddressProvider(_addressProvider).getIBKAIToken();
      address treasury = IAddressProvider(_addressProvider).getTreasury();
      SafeERC20.safeApprove(IERC20(token), treasury, type(uint256).max);
      _hasApproved = true;
    }
    (uint256 leftAmount, uint256 feeAmount) = calcFee(amount, isMint);
    address ibKAI = IAddressProvider(_addressProvider).getIBKAIToken();
    IERC20(ibKAI).transferFrom(_msgSender(), address(this), feeAmount);
    // SafeERC20.safeApprove(IERC20(ibKAI), IAddressProvider(_addressProvider).getTreasury(), feeAmount);
    sendFee(feeAmount);
    return (leftAmount, feeAmount);
  }

  function calcFee(uint256 amount, bool isMint) public view override returns (uint256, uint256) {
    uint256 feeAmount = amount.div(_basisPoint).mul(isMint ? _mintFee : _redeemFee);
    uint256 leftAmount = amount.sub(feeAmount);
    return (leftAmount, feeAmount);
  }

  function calcAmount(uint256 outputAmount, bool isMint) public view override returns (uint256) {
    return outputAmount.mul(_basisPoint).div(_basisPoint.sub(isMint ? _mintFee : _redeemFee));
  }

  function mintFee() external view override returns (uint256) {
    return _mintFee;
  }

  function redeemFee() external view override returns (uint256) {
    return _redeemFee;
  }

  function basisPoint() external view override returns (uint256) {
    return _basisPoint;
  }
}
