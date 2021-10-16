// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './IAddressProvider.sol';

interface IWithAddressProvider {
  function addressProvider() external view returns (address);
}

contract WithAddressProvider is IWithAddressProvider {
  address _addressProvider;

  function addressProvider() public view override returns (address) {
    return _addressProvider;
  }

  function _setAddressProvider(address addressProvider_) internal {
    _addressProvider = addressProvider_;
  }
}
