//SPDX-License-Identifier: UNLICENSED

pragma solidity >0.8.0;

import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

import './IKLS.sol';

/**
 * balanceOfAt(n) - balanceOfAt(n-1) = KLS balance of user after week n
 * supplyAt(n) - supplyAt(n-1) = KLS supply after week n
 * rewards[n] = USDT rewards at week n
 * override balanceOf so user only sees their balance of that week
 * Simulates burning all tokens every week by snapshotting, and recalculating balance and totalSupply (see below)
 */
contract KLS is IKLS, ERC20Snapshot, Ownable {
  using SafeMath for uint256;

  constructor() ERC20('Kalos Trading Volume Token', 'KLS') {}

  // prevent Snapshot from being called if week has not completed
  function snapshot() public override onlyOwner returns (uint256) {
    // require last snapshot to be at least 7 days prior to now
    return _snapshot();
  }

  // begins at 0, first snapshot begins is 1
  function currentSnapshot() public view override returns (uint256) {
    return _getCurrentSnapshotId();
  }

  /**
   * @dev Cannot override balanceOf since ERC20Snapshot implements it (creates infinite loop)
   *      Calculates user balance of the week:
   *      balanceOf()-balanceOfAt() = (current accumulated KLS)-(last snapshotted KLS) = current balance
   */
  function balanceOf_(address account) public view returns (uint256) {
    uint256 snapshotId = currentSnapshot();
    // balanceOf() - balanceOfAt() : current accumulated KLS - last snapshotted KLS = current balance
    return balanceOf(account).sub(balanceOfAt(account, snapshotId));
  }

  /**
   * @dev Cannot override totalSupply since ERC20Snapshot implements it (creates infinite loop)
   *      Calculates supply of the week:
   *      totalSupply()-totalSupplyAt() = (current accumulated KLS supply)-(last snapshotted KLS supply) = current supply
   */
  function totalSupply_() public view returns (uint256) {
    uint256 snapshotId = currentSnapshot();
    return totalSupply().sub(totalSupplyAt(snapshotId));
  }

  /**
   * @dev Mints KLS to account, increasing user accumulated KLS and totalSupply
   */
  function mint(address account, uint256 amount) external override onlyOwner {
    _mint(account, amount);
  }

  // prevent transfers of this token
  function transfer(address recipient, uint256 amount) public pure override returns (bool) {
    return false;
  }

  function transferFrom(
    address sender,
    address recipient,
    uint256 amount
  ) public pure override returns (bool) {
    return false;
  }
}
