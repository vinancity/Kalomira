// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import 'hardhat/console.sol';
import './InterestBearingToken.sol';
import './IBKaiTokenInterface.sol';
import '../protocol/address/WithAddressProvider.sol';

contract IBKAIToken is InterestBearingToken, IBKaiTokenInterface, WithAddressProvider {
  function initialize(address addressProvider_) external payable initializer {
    _setAddressProvider(addressProvider_);
    InterestBearingToken.__InterestBearingToken_init('Interest Bearing KAI', 'ibKAI');
    _mint(_msgSender(), msg.value); // Need to mint initial amount in order not to check on zero division
  }

  /**
   * @notice Receive native asset accidentally from someone transfer to this contract
   */
  receive() external payable {
    // For first deposit will use small amount of KAI to register with validator
    if (_underlyingAmount > 0) {
      this.mint(_msgSender(), msg.value);
    }
  }

  function mint(address account, uint256 amount) external payable override onlyOwner returns (uint256) {
    console.log('Minting for account %s: Address(this)', account, address(this));
    // return 0;
    return _mintAsset(account, amount);
  }

  function redeem(address account, uint256 amount) external override onlyOwner returns (uint256) {
    return _redeemAsset(account, amount);
  }

  function requestFund(uint256 amount) external override {
    // check for address of msg.sender == DistributorFactory only
    // transfer fund to that contract if available
  }

  function returnFund(uint256 amount) external override {
    // check for address of msg.sender == DistributorFactory only
    // receive fund from that contract if available
    this.accrue(); // Notify Accrued event
  }

  function _transferUnderlyingAsset(address account, uint256 amount) internal override returns (bool) {
    // This function need to be implemented on derived contract
    _sendValue(account, amount);
    return true;
  }

  function _receiveUnderlyingAsset(address account, uint256 amount) internal override returns (bool) {
    console.log('Checking receiving value %s: %s', _msgSender(), msg.value);
    // This function need to be implemented on derived contract
    return msg.value == amount;
  }

  function _sendValue(address recipient, uint256 amount) internal {
    require(address(this).balance >= amount, 'Address: insufficient balance');

    (bool success, ) = recipient.call{ value: amount }('');
    require(success, 'Address: unable to send value, recipient may have reverted');
  }
}
