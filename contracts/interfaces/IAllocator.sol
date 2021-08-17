// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface IAllocator {
    function mint() external payable;
    function redeem(uint amount) external;
}