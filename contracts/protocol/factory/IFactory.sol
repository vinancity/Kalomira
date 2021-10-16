// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface IFactory {
  /**
   * @dev Mint KAI using msg.value
   */
  function mint() external payable;

  /**
   * @dev Redeem KAI by input ibKAI amount
   */
  function redeem(uint256 amount) external;

  /**
   * @dev Input KAI, compute output ibKAI
   */
  function getOutputAmount(uint256 inputAmount) external view returns (uint256);

  /**
   * @dev Input ibKAI, compute output KAI
   */
  function getInputAmount(uint256 outputAmount) external view returns (uint256);
}
