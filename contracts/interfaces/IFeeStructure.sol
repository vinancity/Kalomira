// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface IFeeStructure {
    function chargeFee(uint amount, bool isMintOrRedeem) external;

    function mintFee() external view returns (uint);

    function redeemFee() external view returns (uint);
}
