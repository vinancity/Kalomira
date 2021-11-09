pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockLP is ERC20, Ownable {
  constructor(
    string memory name,
    string memory symbol,
    uint256 supply
  ) ERC20(name, symbol) {}

  function faucet(address receiver, uint256 amount) public {
    _mint(receiver, amount);
  }
}
