// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface IFeeProvider {
  /**
   * @dev Charge fee by deducting small of total input `amount`
   * @return uint256 feeCharged
   * @return uint256 feeCharged
   */
  function chargeFee(uint256 amount, bool isMintOrRedeem) external returns (uint256, uint256);

  function calcFee(uint256 amount, bool isMintOrRedeem) external view returns (uint256, uint256);

  function calcAmount(uint256 outputAmount, bool isMint) external view returns (uint256);

  function sendFee(uint256 amount) external;

  function mintFee() external view returns (uint256);

  function redeemFee() external view returns (uint256);

  function basisPoint() external view returns (uint256);
}
