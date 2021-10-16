// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

import '../../../libraries/KalosLib.sol';
import './../IDistributorFactory.sol';
import '../IDistributor.sol';
import '../../address/WithAddressProvider.sol';

contract KardiaDistributorState {}

contract KardiaStakingDistributor is IDistributor, KardiaDistributorState, WithAddressProvider, OwnableUpgradeable {
  function initialize(address addressProvider_) external initializer {
    OwnableUpgradeable.__Ownable_init();
    _setAddressProvider(addressProvider_);
  }

  /**
   * @dev Deposit KAI to benefit contract
   */
  function deposit(uint256 amount) external payable override {
    require(amount == msg.value, 'value not match');
  }

  /**
   * @dev Withdraw KAI from benefit contract
   */
  function withdraw(uint256 amount) external override onlyOwner {
    _sendValue(_msgSender(), amount);
  }

  /**
   * @dev Harvest rewards from benefit contract
   */
  function harvest() external override {
    address validatorContract = IAddressProvider(this.addressProvider()).getValidator();
    _cast(validatorContract, abi.encodeWithSignature('withdrawRewards()'), 0);
  }

  /**
   * @dev Delegate KAI to Kardia staking contract or some lending/farming pool
   */
  function delegate(uint256 amount) external override {
    require(address(this).balance >= amount, 'not enough KAI');
    address validatorContract = IAddressProvider(this.addressProvider()).getValidator();
    _cast(validatorContract, abi.encodeWithSignature('delegate()'), amount);
  }

  /**
   * @dev Undelegate the asset from the contract
   */
  function undelegate(uint256 amount) external override {
    address validatorContract = IAddressProvider(this.addressProvider()).getValidator();
    _cast(validatorContract, abi.encodeWithSignature('undelegate(uint256)', amount), 0);
  }

  /**
   * @dev Indicator between locked or unlocked distributor
   */
  function isLocked() external pure override returns (bool) {
    return true;
  }

  function _cast(
    address target,
    bytes memory data,
    uint256 value
  ) internal {
    (bool ok, bytes memory returndata) = target.call{ value: value }(data);
    if (!ok) {
      if (returndata.length > 0) {
        assembly {
          let returndata_size := mload(returndata)
          revert(add(32, returndata), returndata_size)
        }
      } else {
        revert('bad cast call');
      }
    }
  }

  function _sendValue(address recipient, uint256 amount) internal {
    require(address(this).balance >= amount, 'Address: insufficient balance');

    (bool success, ) = recipient.call{ value: amount }('');
    require(success, 'Address: unable to send value, recipient may have reverted');
  }
}
