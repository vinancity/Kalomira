//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity >=0.7.0;

// We import this library to be able to use console.log
import "hardhat/console.sol";


// This is the main building block for smart contracts.
contract Kalomira {
    // Some string type variables to identify the token.
    string public name = "Kalomira";
    string public symbol = "KAL";

    // The fixed amount of tokens stored in an unsigned integer type variable.
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    // store how much accounts have deposited into contract
    mapping(address => uint256) deposits;

    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     * The `public` modifier makes a function callable from outside the contract.
     */
    constructor() {
        // The totalSupply is assigned to transaction sender, which is the account
        // that is deploying the contract.
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }
    
    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // We can print messages and values using console.log
        console.log(
            "Transferring from %s to %s %s tokens",
            msg.sender,
            to,
            amount
        );

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function deposit(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");

        console.log(
            "Depositing %s tokens from %s to contract at %s",
            amount,
            msg.sender,
            address(this)
        );

        balances[msg.sender] -= amount;
        deposits[msg.sender] += amount;

        console.log(
            "New balance: %s, Deposit balance: %s",
            balances[msg.sender],
            deposits[msg.sender]
        );
    }

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Cannot withdraw specified amount of tokens");

        console.log(
            "Withdrawing %s tokens from contract at %s to %s",
            amount,
            address(this),
            msg.sender
        );

        balances[msg.sender] += amount;
        deposits[msg.sender] -= amount;

        console.log(
            "New balance: %s, Deposit balance: %s",
            balances[msg.sender],
            deposits[msg.sender]
        );
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    // returns the amount currently deposited by the account
    function depositAmount(address account) external view returns (uint256) {
        return deposits[account];
    }
}
