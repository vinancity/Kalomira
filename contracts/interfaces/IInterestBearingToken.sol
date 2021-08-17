// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface IInterestBearingToken {
    function accrue() external;
    function mint(uint amount) external payable returns (uint256);
    function redeem(uint256 amount) external returns (uint256);
    function getMintAmount(uint amount) external view returns (uint);
    function getRedeemAmount(uint ibKaiAmount) external view returns (uint);
}