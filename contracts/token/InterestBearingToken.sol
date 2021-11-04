// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "../libraries/WadRayMath.sol";
import "./IInterestBearingToken.sol";

contract InterestBearingTokenStorage {
  uint256 _underlyingAmount;
  address _underlyingToken;
  event Minted(address owner, uint256 underlyingAmount, uint256 receiptAmount);
  event Redeemed(address owner, uint256 underlyingAmount, uint256 receiptAmount);
  event Accrued();
}

contract InterestBearingToken is
  IInterestBearingToken,
  InterestBearingTokenStorage,
  ERC20Upgradeable,
  OwnableUpgradeable
{
  using SafeMath for uint256;
  using WadRayMath for uint256;

  constructor() payable {}

  function __InterestBearingToken_init(string memory _name, string memory _symbol) internal {
    ERC20Upgradeable.__ERC20_init(_name, _symbol);
    OwnableUpgradeable.__Ownable_init();
  }

  /**
   * @dev Allow a user to mint interest bearing token with underlying asset
   */
  function _mintAsset(address account, uint256 amount) internal virtual returns (uint256) {
    uint256 mintAmount = this.getMintAmount(amount);
    console.log("mint amount: %s", mintAmount);
    _mint(account, mintAmount);
    _underlyingAmount = _underlyingAmount.add(amount);
    bool success = _receiveUnderlyingAsset(account, amount);
    require(success, "insufficient receive amount");
    return mintAmount;
  }

  /**
   * @dev Allow a user to burn a number of wrapped tokens and withdraw the corresponding number of underlying tokens.
   */
  function _redeemAsset(address account, uint256 amount) internal virtual returns (uint256) {
    require(amount <= balanceOf(account), "insufficient balance");
    uint256 outputAmount = this.getRedeemAmount(amount);
    _burn(account, amount);
    _underlyingAmount = _underlyingAmount.sub(amount);
    bool success = _transferUnderlyingAsset(_msgSender(), outputAmount);
    require(success, "asset not able to transfer");
    return outputAmount;
  }

  function accrue() external virtual override {
    emit Accrued();
  }

  function getMintAmount(uint256 amount) external view override returns (uint256) {
    if (amount == 0) {
      return 0;
    }
    uint256 rate = _getRateFromDeposit(amount);
    uint256 subRate = WadRayMath.ray().sub(rate);
    uint256 supply = totalSupply();
    uint256 mintAmount = amount;
    if (supply > 0) {
      mintAmount = (rate.rayMul(supply)).rayDiv(subRate);
    }
    return mintAmount;
  }

  function getRedeemAmount(uint256 ibKaiAmount) external view override returns (uint256) {
    if (ibKaiAmount == 0) {
      return 0;
    }
    uint256 rate = _getRateFromWithdraw(ibKaiAmount);
    uint256 redeemAmount = rate.rayMul(_totalUnderlyingAmount());
    return redeemAmount;
  }

  function _totalUnderlyingAmount() internal view returns (uint256) {
    return _underlyingAmount.add(_pendingAcrueAmount());
  }

  function _getRateFromDeposit(uint256 amount) internal view returns (uint256) {
    uint256 totalKAI = _totalUnderlyingAmount().add(amount);
    uint256 rate = amount.rayDiv(totalKAI);
    return rate;
  }

  function _getRateFromWithdraw(uint256 amount) internal view returns (uint256) {
    uint256 rate = amount.rayDiv(totalSupply());
    return rate;
  }

  /**
   * @dev This function need to be override on implementation contract
   */
  function _pendingAcrueAmount() internal view virtual returns (uint256) {
    return 0;
  }

  function _transferUnderlyingAsset(address account, uint256 amount) internal virtual returns (bool) {
    // This function need to be implemented on derived contract
    return false;
  }

  function _receiveUnderlyingAsset(address account, uint256 amount) internal virtual returns (bool) {
    // This function need to be implemented on derived contract
    return false;
  }
}
