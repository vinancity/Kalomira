// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IKardiaValidator {
    function delegate() external payable;
    function undelegateWithAmount(uint256 amount) external;
    function withdraw() external;
    function withdrawCommission() external;
    function getDelegationRewards(address delAddr) external view returns (uint256);
}