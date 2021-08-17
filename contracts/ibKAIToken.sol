// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./InterestBearingToken.sol";

contract ibKAIToken is InterestBearingToken {

    function initialize() external initializer payable  {
        InterestBearingToken.__InterestBearingToken_init("Interest Bearing KAI", "ibKAI");
        _mint(_msgSender(), msg.value); // Need to mint initial amount in order not to check on zero division
    }

    /**
    * @notice Receive native asset accidentally from someone transfer to this contract
    */
    receive() external payable onlyOwner {
        // For first deposit will use small amount of KAI to register with validator
        if (_underlyingAmount > 0) {
            this.mint(msg.value);
        }
    }

    function mint(uint256 amount)
        external
        override
        payable
    returns (uint256) {
        return this.mint(amount);
    }

    function redeem(uint256 amount)
        external
        override
    returns (uint256) {
        return this.redeem(amount);
    }

    function _transferUnderlyingAsset(address account, uint amount) internal override returns (bool) {
        // This function need to be implemented on derived contract
        _sendValue(account, amount);
        return true;
    }

    function _receiveUnderlyingAsset(address account, uint amount) internal override returns (bool) {
        require(account == _msgSender(), "invalid caller");
        // This function need to be implemented on derived contract
        return msg.value == amount;
    }

    function accrue() external virtual override {
        emit Accrued();
    }

    function _sendValue(address recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}