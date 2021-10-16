// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAddressProvider {
  function getKalosToken() external view returns (address);

  function getIBKAIToken() external view returns (address);

  function getKLSToken() external view returns (address);

  function getWKAIToken() external view returns (address);

  function getUSDTToken() external view returns (address);

  function getValidator() external view returns (address);

  function getFeeProvider() external view returns (address);

  function getFactory() external view returns (address);

  function getDistributor() external view returns (address);

  function getEpoch() external view returns (address);

  function getFarmDistributor() external view returns (address);

  function getMasterChef() external view returns (address);

  function getTreasury() external view returns (address);

  function getDexRouter() external view returns (address);

  function getDexFactory() external view returns (address);

  function getVolumeCounter() external view returns (address);
}
