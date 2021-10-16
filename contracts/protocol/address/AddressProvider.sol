// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

import './IAddressProvider.sol';

contract AddressProvider is IAddressProvider, OwnableUpgradeable {
  mapping(bytes32 => address) private addresses;

  bytes32 private constant KALOS_TOKEN = 'KALOS_TOKEN';
  bytes32 private constant IBKAI_TOKEN = 'IBKAI_TOKEN';
  bytes32 private constant KLS_TOKEN = 'KLS_TOKEN';
  bytes32 private constant WKAI_TOKEN = 'WKAI_TOKEN';
  bytes32 private constant USDT_TOKEN = 'USDT_TOKEN';

  bytes32 private constant FEE_PROVIDER = 'FEE_PROVIDER';
  bytes32 private constant FACTORY = 'FACTORY';
  bytes32 private constant DISTRIBUTOR = 'DISTRIBUTOR';
  bytes32 private constant EPOCH = 'EPOCH';
  bytes32 private constant FARM_DISTRIBUTOR = 'FARM_DISTRIBUTOR';
  bytes32 private constant MASTER_CHEF = 'MASTER_CHEF';
  bytes32 private constant TREASURY = 'TREASURY';
  bytes32 private constant VALIDATOR = 'VALIDATOR';

  bytes32 private constant VOLUME_COUNTER = 'VOLUME_COUNTER';
  bytes32 private constant DEX_ROUTER = 'DEX_ROUTER';
  bytes32 private constant DEX_FACTORY = 'DEX_FACTORY';

  function initialize() external initializer {
    OwnableUpgradeable.__Ownable_init();
  }

  function getAddress(bytes32 _key) internal view returns (address) {
    return addresses[_key];
  }

  function setAddress(bytes32 _key, address _value) external onlyOwner {
    addresses[_key] = _value;
  }

  function getKalosToken() external view override returns (address) {
    return getAddress(KALOS_TOKEN);
  }

  function getIBKAIToken() external view override returns (address) {
    return getAddress(IBKAI_TOKEN);
  }

  function getKLSToken() external view override returns (address) {
    return getAddress(KLS_TOKEN);
  }

  function getWKAIToken() external view override returns (address) {
    return getAddress(WKAI_TOKEN);
  }

  function getUSDTToken() external view override returns (address) {
    return getAddress(USDT_TOKEN);
  }

  function getValidator() external view override returns (address) {
    return getAddress(VALIDATOR);
  }

  function getFeeProvider() external view override returns (address) {
    return getAddress(FEE_PROVIDER);
  }

  function getFactory() external view override returns (address) {
    return getAddress(FACTORY);
  }

  function getDistributor() external view override returns (address) {
    return getAddress(DISTRIBUTOR);
  }

  function getEpoch() external view override returns (address) {
    return getAddress(EPOCH);
  }

  function getFarmDistributor() external view override returns (address) {
    return getAddress(FARM_DISTRIBUTOR);
  }

  function getMasterChef() external view override returns (address) {
    return getAddress(MASTER_CHEF);
  }

  function getTreasury() external view override returns (address) {
    return getAddress(TREASURY);
  }

  function getDexRouter() external view override returns (address) {
    return getAddress(DEX_ROUTER);
  }

  function getDexFactory() external view override returns (address) {
    return getAddress(DEX_FACTORY);
  }

  function getVolumeCounter() external view override returns (address) {
    return getAddress(VOLUME_COUNTER);
  }
}
