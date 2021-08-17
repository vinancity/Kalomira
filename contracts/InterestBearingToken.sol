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

import "./libraries/WadRayMath.sol";
import "./interfaces/IInterestBearingToken.sol";

contract InterestBearingTokenStorage {
    uint _underlyingAmount;
    address _underlyingToken;
    event Minted(address owner, uint underlyingAmount, uint receiptAmount);
    event Redeemed(address owner, uint underlyingAmount, uint receiptAmount);
    event Accrued();
}

contract InterestBearingToken is
    IInterestBearingToken,
    InterestBearingTokenStorage,
    ERC20Upgradeable,
    OwnableUpgradeable
{
    using SafeMath for uint;
    using WadRayMath for uint;

    constructor() payable
    { }

    function __InterestBearingToken_init(string memory _name, string memory _symbol) internal {
        ERC20Upgradeable.__ERC20_init(_name, _symbol);
        OwnableUpgradeable.__Ownable_init();
    }

    /**
     * @dev Allow a user to mint interest bearing token with underlying asset
     */
    function mint(uint amount) external payable override virtual returns (uint256) {
        uint mintAmount = this.getMintAmount(amount);
        _mint(_msgSender(), mintAmount);
        _underlyingAmount = _underlyingAmount.add(amount);
        bool success = _receiveUnderlyingAsset(_msgSender(), amount);
        require(success, "insufficient receive amount");
        return mintAmount;
    }

    /**
     * @dev Allow a user to burn a number of wrapped tokens and withdraw the corresponding number of underlying tokens.
     */
    function redeem(uint256 amount) external override virtual returns (uint256) {
        require(amount <= balanceOf(_msgSender()), "insufficient balance");
        uint outputAmount = this.getRedeemAmount(amount);
        _burn(_msgSender(), amount);
        bool success = _transferUnderlyingAsset(_msgSender(), outputAmount);
        require(success, "asset not able to transfer");
        return outputAmount;
    }

    function accrue() external virtual override {
        emit Accrued();
    }

    function getMintAmount(uint amount) external override view returns (uint) {
        uint rate = _getRateFromDeposit(amount);
        uint subRate = WadRayMath.ray().sub(rate);
        uint supply = totalSupply();
        uint mintAmount = amount;
        if (supply > 0) {
            mintAmount = (rate.rayMul(supply)).rayDiv(subRate);
        }
        return mintAmount;
    }

    function getRedeemAmount(uint ibKaiAmount) external view override returns (uint) {
        uint rate = _getRateFromWithdraw(ibKaiAmount);
        uint redeemAmount = rate.rayMul(_totalUnderlyingAmount());
        return redeemAmount;
    }

    // function sendValue(address recipient, uint256 amount) internal {
    //     require(address(this).balance >= amount, "Address: insufficient balance");

    //     (bool success, ) = recipient.call{value: amount}("");
    //     require(success, "Address: unable to send value, recipient may have reverted");
    // }

    function _totalUnderlyingAmount() internal view returns (uint) {
        return _underlyingAmount.add(_pendingAcrueAmount());
    }

    function _getRateFromDeposit(uint amount) internal view returns (uint) {
        uint totalKAI = _totalUnderlyingAmount().add(amount);
        uint rate = amount.rayDiv(totalKAI);
        return rate;
    }

    function _getRateFromWithdraw(uint amount) internal view returns (uint) {
        uint rate = amount.rayDiv(totalSupply());
        return rate;
    }

    /**
    * @dev This function need to be override on implementation contract
    */
    function _pendingAcrueAmount() internal virtual view returns (uint) {
        return 0;
    }

    function _transferUnderlyingAsset(address account, uint amount) internal virtual returns (bool) {
        // This function need to be implemented on derived contract
        return false;
    }

    function _receiveUnderlyingAsset(address account, uint amount) internal virtual returns (bool) {
        // This function need to be implemented on derived contract
        return false;
    }
}
