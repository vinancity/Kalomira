// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface IKardiaValidator {
    function delegate() external payable;
    function undelegateWithAmount(uint256 amount) external;
    function withdraw() external;
    function withdrawCommission() external;
    function getDelegationRewards(address delAddr) external view returns (uint256);
}

contract KAIParking {
    event Deposited(uint amount);

    address validatorContract = 0x4952057973256F4f107eA854028Edfae2640b5Bd;

    constructor() payable { }

    receive() external payable {
        emit Deposited(msg.value);
    }

    function getValidatorContract() external view returns (address) {
        return validatorContract;
    }

    function _cast(address target, bytes memory data, uint value) internal {
        (bool ok, bytes memory returndata) = target.call{value: value}(data);
        if (!ok) {
            if (returndata.length > 0) {
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
        _cast(validatorContract, abi.encodeWithSignature("delegate()"), amount);
        return true;
    }

    function withdrawRewards() external returns (bool) {
        _cast(validatorContract, abi.encodeWithSignature("withdrawRewards()"), 0);
        return true;
    }

    function undelegateAll() external {
        _cast(validatorContract, abi.encodeWithSignature("undelegate()"), 0);
    }

    function undelegate(uint amount) external {
        (bool success, bytes memory data) = validatorContract.call(abi.encodeWithSelector(0x41443a39, amount));
        require(
            success && (data.length == 0),
            'UNDELEGATE_FAILED'
        );
    }

    function deposit() external payable returns (bool) {
        emit Deposited(msg.value);
        return true;
    }

    /**
    * @notice Retrieve pending rewards from Kardia validator contract
    */
    function pendingRewards() external view returns (uint) {
        return IKardiaValidator(validatorContract).getDelegationRewards(address(this));
    }

    /**
     * @dev Allow a user to burn a number of wrapped tokens and withdraw the corresponding number of underlying tokens.
     */
    function withdraw(uint256 amount) external returns (bool) {
        sendValue(msg.sender, amount);
        return true;
    }

    function sendValue(address recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}
