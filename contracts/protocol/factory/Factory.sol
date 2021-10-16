// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import 'hardhat/console.sol';
import './IFactory.sol';
import '../fee/IFeeProvider.sol';
import '../address/IAddressProvider.sol';
import '../address/WithAddressProvider.sol';
import '../../token/IBKaiTokenInterface.sol';
import '../../token/IInterestBearingToken.sol';

contract FactoryState {
  address _config;
  /**
   *@dev check if necessary contracts are approved for IBKAI transactions
   */
  bool _hasApproved;
}

contract Factory is IFactory, FactoryState, WithAddressProvider, OwnableUpgradeable {
  function initialize(address addressProvider_) external initializer {
    OwnableUpgradeable.__Ownable_init();
    _setAddressProvider(addressProvider_);
    _hasApproved = false;
  }

  receive() external payable {
    console.log('factory got paid', msg.value);
  }

  /**
   * @dev As ibKAI is a KRC20 token, we have to deduct the fee after minting
   */
  function mint() external payable override {
    uint256 value = msg.value;
    require(value > 1000, 'mint value to small');
    address ibKAI = IAddressProvider(_addressProvider).getIBKAIToken();
    address feeProvider = IAddressProvider(_addressProvider).getFeeProvider();

    if (!_hasApproved) {
      // approve fee provider
      SafeERC20.safeApprove(IERC20(ibKAI), feeProvider, type(uint256).max);
      _hasApproved = true;
    }

    uint256 mintedAmount = IBKaiTokenInterface(ibKAI).mint{ value: value }(address(this), value);
    //SafeERC20.safeApprove(IERC20(ibKAI), feeProvider, mintedAmount);
    (uint256 leftAmount, ) = IFeeProvider(feeProvider).chargeFee(mintedAmount, true);
    SafeERC20.safeTransfer(IERC20(ibKAI), _msgSender(), leftAmount);
  }

  /**
   * @dev As KAI is a native token, we have to deduct the fee before redeeming
   * Because this will charge the fee manually, we have to calcFee before and send the fee to treasury manually
   * We also want to send fee as ibKAI KRC-20 to treasury, this will allow treasury compound it's interest as KAI from time to time
   */
  function redeem(uint256 amount) external override {
    IAddressProvider addrProvider = IAddressProvider(this.addressProvider());
    address feeProvider = addrProvider.getFeeProvider();
    (
      uint256 toRedeemAmount,
      uint256 feeAmount /** as ibKAI */
    ) = IFeeProvider(feeProvider).calcFee(amount, false);

    // transfer iBKAI to this
    address ibKAI = addrProvider.getIBKAIToken();
    SafeERC20.safeTransferFrom(IERC20(ibKAI), _msgSender(), address(this), amount);

    // check if enough KAI reserves to redeem
    uint256 reserveAmount = address(ibKAI).balance;
    uint256 redeemAmount = IInterestBearingToken(ibKAI).getRedeemAmount(toRedeemAmount);

    // request KAI amount equal to redeem amount + reserve amount (to increase reserves on ibKAI contract while redeeming user KAI)
    if (redeemAmount >= reserveAmount) {
      IBKaiTokenInterface(ibKAI).requestFund(redeemAmount);
    }

    uint256 redeemedAmount = IBKaiTokenInterface(ibKAI).redeem(address(this), toRedeemAmount);
    _sendValue(_msgSender(), redeemedAmount);

    SafeERC20.safeTransfer(IERC20(ibKAI), feeProvider, feeAmount);
    IFeeProvider(feeProvider).sendFee(feeAmount);
  }

  /**
   * @dev Input KAI, compute output ibKAI
   */
  function getOutputAmount(uint256 inputAmount) external view override returns (uint256) {
    return IInterestBearingToken(IAddressProvider(this.addressProvider()).getIBKAIToken()).getMintAmount(inputAmount);
  }

  /**
   * @dev Input ibKAI, compute output KAI
   */
  function getInputAmount(uint256 outputAmount) external view override returns (uint256) {
    return
      IInterestBearingToken(IAddressProvider(this.addressProvider()).getIBKAIToken()).getRedeemAmount(outputAmount);
  }

  function _sendValue(address recipient, uint256 amount) internal {
    require(address(this).balance >= amount, 'Address: insufficient balance');

    (bool success, ) = recipient.call{ value: amount }('');
    require(success, 'Address: unable to send value, recipient may have reverted');
  }
}
