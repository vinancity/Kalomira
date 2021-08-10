// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interfaces/IKardiaValidator.sol";

contract KardiaStakingMock is IKardiaValidator {
    uint pendingInterest;

    constructor() {
        pendingInterest = 19200130000000000000;
    }


    function delegate() override external payable {

    }

    function undelegateWithAmount(uint256 amount) override external {}

    function withdraw() override external {}

    function withdrawCommission() override external {}

    function getDelegationRewards(address delAddr) override external view returns (uint256) {
        require(delAddr != address(0), "invalid");
        return pendingInterest;
    }

    function addInterest(uint amount) external {
        pendingInterest += amount;
    }
}