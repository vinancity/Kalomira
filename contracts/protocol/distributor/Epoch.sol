// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';

import 'hardhat/console.sol';

contract Epoch {
  using SafeMath for uint256;
  uint256 private _startAt;
  uint256 private _epochCount;
  uint256 private _blockPerEpoch = 2888; // 4 hours

  modifier isEpochExpired() {
    uint256 nextEpochBlock = this.getNextEpochBlock();
    require(this.getBlockNumber() < nextEpochBlock, 'EpochBlock: still in range');
    _;
  }

  modifier isEpochInRange() {
    uint256 nextEpochBlock = this.getNextEpochBlock();
    uint256 currentEpochBlock = this.getCurrentEpochBlock();
    uint256 currentBlock = this.getBlockNumber();
    require(currentBlock > currentEpochBlock && currentBlock <= nextEpochBlock, 'EpochBlock: expired');
    _;
  }

  function initialize() external virtual {
    _startAt = this.getBlockNumber();
    _epochCount = 0;
  }

  function getBlockNumber() external view returns (uint256) {
    return block.number;
  }

  function getEpochAtBlock(uint256 block_) external view returns (uint256) {
    if (block_ <= _startAt) {
      return 0;
    }
    return block_.sub(_startAt).mod(_blockPerEpoch).add(1);
  }

  function getCurrentEpochBlock() external view returns (uint256) {
    return _startAt.mul(_epochCount).mul(_blockPerEpoch);
  }

  function getNextEpochBlock() external view returns (uint256) {
    return _startAt.mul(_epochCount.add(1).mul(_blockPerEpoch));
  }

  function goNextEpoch() external virtual isEpochExpired {
    _epochCount += 1;
  }
}
