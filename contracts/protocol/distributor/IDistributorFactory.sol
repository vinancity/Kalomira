// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './IDistributor.sol';

interface IDistributorFactory {
  function registerDistributor(uint256 id_, IDistributor distributor_) external returns (bool);

  function getDistributorById(uint256 id) external view returns (address);

  function getDistributorList() external view returns (address[] memory);

  function getDistributorsByPage(uint256 page, uint256 resultsPerPage) external view returns (address[] memory);

  function distribute() external;
}
