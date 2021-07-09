// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "./libraries/WadRayMath.sol";
import "./interfaces/IKardiaStaking.sol";

contract VKAI is ERC20, Ownable {
    using SafeMath for uint;
    using WadRayMath for uint;

    uint totalReserve;
    uint totalStaking;
    uint totalDeposit;
    address stakingContract;
    address validatorContract;

    uint constant PRECISION = 10**4;

    constructor() ERC20("Interest Bearing KAI Token", "ibKAI") {
        totalReserve = 0;
        // totalDeposit = 0;
        totalDeposit = 100 ether;
        _mint(_msgSender(), 100 ether);
    }

    function setStakingContract(address _stakingContract, address _validatorContract) external onlyOwner {
        stakingContract = _stakingContract;
        validatorContract = _validatorContract;
    }

    function pendingRewards() external view returns (uint) {
        return IKardiaStaking(stakingContract).getDelegationRewards(validatorContract, address(this));
    }

    function getTotalKAIIncludeReward() external view returns (uint) {
        return totalDeposit.add(this.pendingRewards());
    }

    /**
     * @dev Allow a user to deposit underlying tokens and mint the corresponding number of wrapped tokens.
     */
    function deposit() external payable returns (bool) {
        uint mintAmount = _getMintAmount(msg.value);
        _mint(_msgSender(), mintAmount);
        totalDeposit = totalDeposit.add(msg.value);
        return true;
    }

    /**
     * @dev Allow a user to burn a number of wrapped tokens and withdraw the corresponding number of underlying tokens.
     */
    function withdraw(uint256 amount) external returns (bool) {
        _burn(_msgSender(), amount);
        _safeTransferKAI(_msgSender(), amount);
        return true;
    }

    function _getRateFromDeposit(uint kaiAmount) internal view returns (uint) {
        uint totalKAI = this.getTotalKAIIncludeReward().add(kaiAmount);
        uint rate = kaiAmount.rayDiv(totalKAI);
        console.log("kai Amount: %s - totalKAI: %s - rate: %s ", kaiAmount, totalKAI, rate);
        return rate;
    }

    function _getMintAmount(uint kaiAmount) internal view returns (uint) {
        uint rate = _getRateFromDeposit(kaiAmount);
        uint subRate = WadRayMath.ray().sub(rate);
        uint supply = totalSupply();
        uint vkaiToMint = kaiAmount;
        if (supply > 0) {
            vkaiToMint = (rate.rayMul(supply)).rayDiv(subRate);
        }
        console.log("vkai to %s mint %s - subRate: %s:", supply, vkaiToMint, subRate);
        return vkaiToMint;
    }

    function _safeTransferKAI(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, "!safeTransferKAI");
    }
}