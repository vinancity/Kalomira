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
    address validatorContract = 0x4952057973256F4f107eA854028Edfae2640b5Bd;

    constructor() ERC20("Interest Bearing KAI", "ibKAI") payable
    { }

    function initialize() external payable initializer {
        totalDeposit = msg.value;
        totalReserve = msg.value;
        _mint(_msgSender(), msg.value);
        // this.setStakingContract(
        //     0x0000000000000000000000000000000000001337,
        //     0x4952057973256F4f107eA854028Edfae2640b5Bd
        // ); // mock test only
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

    function _cast(address target, bytes memory data, uint value) internal {
        (bool ok, bytes memory returndata) = target.call{value: value}(data);
        if (!ok) {
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly
                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert('bad cast call');
            }
        }
    }

    function delegate(uint amount) external returns (bool) {
        // _cast(validatorContract, abi.encodeWithSignature("delegate()"), amount);
        (bool success, bytes memory data) = validatorContract.call{value: amount}(abi.encodeWithSelector(0xc89e4361));
        require(
            success && (data.length == 0),
            'Kalomira: DELEGATE_FAILED'
        );
        totalStaking += amount;
        return true;
    }

    function withdrawRewards() external returns (bool) {
        // (bool success, bytes memory returndata) = validatorContract.call(
        //     abi.encode(bytes4(keccak256("withdrawRewards()")))
        // );
        // require(success == true, string (returndata));
        _cast(validatorContract, abi.encodeWithSignature("withdrawRewards()"), 0);
        totalDeposit += this.pendingRewards();
        return true;
    }

    function undelegateAll() external {
        // (bool success, bytes memory returndata) = validatorContract.call(
        //     abi.encodePacked(bytes4(keccak256(bytes("undelegate()"))))
        //     // abi.encodeWithSignature("undelegate()")
        // );
        // require(success == true, string (returndata));
        // totalStaking = 0;
        // return true;

        _cast(validatorContract, abi.encodeWithSignature("undelegate()"), 0);
        // (bool success, bytes memory data) = validatorContract.call(abi.encodeWithSelector(0x92ab89bb));
        // require(
        //     success && (data.length == 0),
        //     'Kalomira: UNDELEGATE_FAILED'
        // );

        // (bool success, bytes memory result) = address(validatorContract).call{gas: 3000000}(
        //     abi.encode(bytes4(keccak256("undelegate()")))
        // );
        // if (success == false) {
        //     assembly {
        //         let ptr := mload(0x40)
        //         let size := returndatasize()
        //         returndatacopy(ptr, 0, size)
        //         revert(ptr, size)
        //     }
        // }
        // return result;
    }

    function undelegate(uint amount) external {
        // (bool success, bytes memory returndata) = validatorContract.call(
        //     // abi.encodeWithSignature("undelegateWithAmount(uint256)", amount)
        //     abi.encodePacked(bytes4(keccak256("undelegateWithAmount(uint256)")), amount)
        // );
        // require(success == true, string (returndata));
        // totalStaking = totalStaking.sub(amount);
        // return data;

        (bool success, bytes memory data) = validatorContract.call(abi.encodeWithSelector(0x41443a39, amount));
        require(
            success && (data.length == 0),
            'Kalomira: UNDELEGATE_FAILED'
        );

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