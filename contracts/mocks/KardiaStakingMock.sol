// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../interfaces/IKardiaStaking.sol";

// /**
//  * @dev Interface of the ERC20 standard as defined in the EIP.
//  */
// interface IKardiaStaking {
//     function delegate(address valAddr) external payable;
//     function undelegate(address valAddr, uint256 amount) external;
//     function withdraw(address valAddr) external;
//     function withdrawReward(address valAddr) external;
//     function getDelegationRewards(address valAddr, address delAddr) external view returns (uint256);
//     function getValidator(address valAddr) external view returns (uint256, uint256, bool, uint256, uint256, uint256);
//     function getDelegationsByValidator(address valAddr) external view returns (address[] memory, uint256[] memory);
//     function getDelegation(address valAddr, address delAddr) external view returns (uint256);
// }


contract KardiaStakingMock is IKardiaStaking {
    uint pendingInterest;

    constructor() {
        pendingInterest = 19200130000000000000;
    }

    function getDelegationRewards(address valAddr, address delAddr) override external view returns (uint256) {
        require(valAddr != address(0), "invalid");
        require(delAddr != address(0), "invalid");
        return pendingInterest;
    }

    function addInterest(uint amount) external {
        pendingInterest += amount;
    }
}