//SPDX-License-Identifier: UNLICENSED

pragma solidity >0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Kalos is ERC20, Ownable {
  constructor() ERC20('Kalos', 'KALO') {}

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
  }

  function _transferOwnership(address newOwner) public onlyOwner {
    transferOwnership(newOwner);
  }
}
