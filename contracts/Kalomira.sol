//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Kalomira is ERC20, Ownable{

    mapping(address => uint256) balances;
    mapping(address => uint256) deposits;
    
    constructor() ERC20("Kalomira", "KAL") { }


    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _transferOwnership(address newOwner) public onlyOwner {
        transferOwnership(newOwner);
    }


    function deposit(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");

        balances[msg.sender] -= amount;
        deposits[msg.sender] += amount;
    }

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Cannot withdraw specified amount of tokens");

        balances[msg.sender] += amount;
        deposits[msg.sender] -= amount;
    }

    // returns the amount currently deposited by the account
    function depositAmount(address account) external view returns (uint256) {
        return deposits[account];
    }
}
