// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VKAI is ERC20, Ownable {
    uint totalReserve;
    uint totalStaking;
    address stakingContract;

    constructor() ERC20("Virtual KAI", "vKAI") {
        totalReserve = 0;
    }

    /**
     * @dev Allow a user to deposit underlying tokens and mint the corresponding number of wrapped tokens.
     */
    function deposit() external payable returns (bool) {
        _mint(_msgSender(), msg.value);
        return true;
    }

    /**
     * @dev Allow a user to burn a number of wrapped tokens and withdraw the corresponding number of underlying tokens.
     */
    function withdraw(uint256 amount) external returns (bool) {
        _burn(_msgSender(), amount);
        _safeTransferKAI(_msgSender(), amount);
        return true;
    }

    function _safeTransferKAI(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, "!safeTransferKAI");
    }
}