// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

import "./libraries/WadRayMath.sol";
import "./interfaces/IKardiaValidator.sol";

contract ibKAI is ERC20, Ownable, Initializable {
    using SafeMath for uint;
    using WadRayMath for uint;

    uint public totalReserve;
    uint public totalStaking;
    uint public totalDeposit;
    address stakingContract;
    address validatorContract;

    constructor() ERC20("Interest Bearing KAI", "ibKAI") payable
    { }

    function initialize() external payable initializer {
        totalDeposit = msg.value;
        totalReserve = msg.value;
        _mint(_msgSender(), msg.value);
    }

    /**
    * @notice Receive KAI accidentally from someone transfer to this contract
    */
    receive() external payable {
        // For first deposit will use small amount of KAI to register with validator
        if (totalDeposit > 0) {
            this.deposit();
        }
    }

    function getTotalReserve() external view returns (uint) {
        return totalReserve;
    }

    function getTotalStaking() external view returns (uint) {
        return totalStaking;
    }

    function getTotalDeposit() external view returns (uint) {
        return totalDeposit;
    }

    function getStakingContract() external view returns (address) {
        return stakingContract;
    }

    function getValidatorContract() external view returns (address) {
        return validatorContract;
    }

    function setStakingContract(address _stakingContract, address _validatorContract) external onlyOwner {
        stakingContract = _stakingContract;
        validatorContract = _validatorContract;
    }

    function delegate(uint amount) external returns (bool) {
        (bool success, ) = validatorContract.call{value:amount}(
            // abi.encode(bytes4(keccak256("delegate()")))
            abi.encodePacked(bytes4(keccak256("delegate()")))
            // abi.encode(bytes4(keccak256("delegate()")))
        );
        require(success == true, "not delegatable");
        totalStaking += amount;
        return true;
    }

    function withdrawRewards() external returns (bool) {
        (bool success, ) = validatorContract.call(
            abi.encode(bytes4(keccak256("withdrawRewards()")))
        );
        require(success == true, "not withdrawable");
        totalDeposit += this.pendingRewards();
        return true;
    }

    function undelegateAll() external returns (bool) {
        (bool success, ) = validatorContract.call(
            abi.encodePacked(bytes4(keccak256("undelegate()")))
        );
        require(success);
        totalStaking = 0;
        return true;
    }

    function undelegate(uint amount) external {
        (bool success, ) = validatorContract.call(
            // abi.encodeWithSignature("undelegateWithAmount(uint256)", amount)
            abi.encodePacked(bytes4(keccak256(bytes("undelegateWithAmount(uint256)"))), amount)
        );
        require(success);
        // totalStaking = totalStaking.sub(amount);
        // return data;
    }

    function executeTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) public onlyOwner returns (bytes memory) {
        bytes memory callData;

        if (bytes(signature).length == 0) {
            callData = data;
        } else {
            callData = abi.encodePacked(bytes4(keccak256(bytes(signature))), data);
        }
        // solium-disable-next-line security/no-call-value
        (bool success, bytes memory returnData) = target.call{value: value}(callData);
        require(success, string("executeTransaction: Transaction execution reverted."));
        return returnData;
    }

    /**
    * @notice Retrieve pending rewards from Kardia validator contract
    */
    function pendingRewards() external view returns (uint) {
        // Prevent Kardia Staking contract to revert transaction on view
        if (totalStaking == 0) {
            return 0;
        }
        return IKardiaValidator(validatorContract).getDelegationRewards(address(this));
        // (bool success, bytes memory returnedData) = validatorContract.staticcall(
        //     abi.encode(bytes4(keccak256('getDelegationRewards(address)')) , address(this))
        // );
        // return abi.decode(returnedData, (uint));
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
        require(amount <= balanceOf(_msgSender()), "insufficient balance");
        uint kaiAmount = _getKAIRedeemAmount(amount);
        console.log("supply: %s - balance: %s - amount: %s", totalDeposit, amount, kaiAmount);
        _burn(_msgSender(), amount); // burn ibKAI
        sendValue(_msgSender(), kaiAmount);
        return true;
    }

    function _getRateFromDeposit(uint kaiAmount) internal view returns (uint) {
        uint totalKAI = this.getTotalKAIIncludeReward().add(kaiAmount);
        uint rate = kaiAmount.rayDiv(totalKAI);
        console.log("kai Amount: %s - totalKAI: %s - rate: %s ", kaiAmount, totalKAI, rate);
        return rate;
    }

    function _getRateFromWithdraw(uint ibKaiAmount) internal view returns (uint) {
        uint rate = ibKaiAmount.rayDiv(totalSupply());
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

    function _getKAIRedeemAmount(uint ibKaiAmount) internal view returns (uint) {
        uint rate = _getRateFromWithdraw(ibKaiAmount);
        uint kaiAmount = rate.rayMul(this.getTotalKAIIncludeReward());
        return kaiAmount;
    }

    function sendValue(address recipient, uint256 amount) internal {
        console.log("balance: %s - amount: %s", address(this).balance, amount);
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}