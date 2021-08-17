// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./interfaces/IAllocator.sol";
import "./interfaces/IInterestBearingToken.sol";

contract AllocationState {
    address _ibKAI;
    address _feeStructure;
}

contract Allocator is IAllocator, AllocationState, OwnableUpgradeable, ReentrancyGuardUpgradeable {

    function initialize(address ibKAI_, address feeStructure__) external initializer {
        OwnableUpgradeable.__Ownable_init();
        ReentrancyGuardUpgradeable.__ReentrancyGuard_init();
        _ibKAI = ibKAI_;
        _feeStructure = feeStructure__;
    }

    function mint() external override payable nonReentrant {
        uint amount = msg.value;
        cast(_ibKAI, abi.encodeWithSignature("mint(uint256)"), amount);
        IInterestBearingToken(_ibKAI).mint(amount);
    }

    function redeem(uint amount) external override nonReentrant {

    }

    function cast(address target, bytes memory data, uint value) internal {
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
}