// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface IInterestBearingToken {
    function accrue() external;
    function mint(uint amount) external payable returns (bool);
    function redeem(uint256 amount) external returns (bool);
    function getMintAmount(uint amount) external view returns (uint);
    function getRedeemAmount(uint ibKaiAmount) external view returns (uint);
}