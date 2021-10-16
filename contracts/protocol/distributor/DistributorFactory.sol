// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

import '../../libraries/KalosLib.sol';
import './IDistributorFactory.sol';
import './IDistributor.sol';
import '../address/WithAddressProvider.sol';

contract DistributorFactoryState {
  event DistributorRegistered(uint256 _id, address _distributor);
  uint256 constant PAGE_SIZE = 10;
  uint256 public lastPage;

  mapping(uint256 => IDistributor) distributors;
  mapping(uint256 => address[]) distributorsByPage;
  address[] distributorList;
}

/**
 * Handle how KAI is distributing between differents contract strategies for earning more KAI
 */
contract DistributorFactory is IDistributorFactory, DistributorFactoryState, WithAddressProvider, OwnableUpgradeable {
  function initialize(address addressProvider_) external initializer {
    OwnableUpgradeable.__Ownable_init();
    _setAddressProvider(addressProvider_);
  }

  function registerDistributor(uint256 id_, IDistributor distributor_) external override returns (bool) {
    require(address(distributors[id_]) == address(0), 'distributor existed');

    address distributorAddr = address(distributor_);
    distributors[id_] = distributor_;
    distributorList.push(distributorAddr);

    if (distributorsByPage[lastPage].length == PAGE_SIZE) {
      lastPage++;
    }
    distributorsByPage[lastPage].push(distributorAddr);
    emit DistributorRegistered(id_, distributorAddr);
    return true;
  }

  function getDistributorById(uint256 id_) external view override returns (address) {
    return address(distributors[id_]);
  }

  function getDistributorList() external view override returns (address[] memory) {
    return distributorList;
  }

  function getDistributorsByPage(uint256 page, uint256 resultsPerPage)
    external
    view
    override
    returns (address[] memory)
  {
    return KalosLib.getItemsByPage(page, resultsPerPage, distributorList);
  }

  function distribute() external override {
    // check epoch
    // calculate allocation for each distributor
    // loop through each distributor and delegate KAI
  }

  /**
   * @dev below function used for unit testing
   */

  receive() external payable {}

  // function farmDeposit(uint256 amount) external {
  //   address farmDistributor = IAddressProvider(_addressProvider).getFarmDistributor();
  //   IDistributor(farmDistributor).deposit{ value: amount }(amount);
  // }

  // function farmHarvest() external {
  //   address farmDistributor = IAddressProvider(_addressProvider).getFarmDistributor();
  //   IDistributor(farmDistributor).harvest();
  // }

  // function farmWithdraw(uint256 amount) external {
  //   address farmDistributor = IAddressProvider(_addressProvider).getFarmDistributor();
  //   IDistributor(farmDistributor).withdraw(amount);
  // }

  // function farmDelegate(uint256 amount) external {
  //   address farmDistributor = IAddressProvider(_addressProvider).getFarmDistributor();
  //   IDistributor(farmDistributor).delegate(amount);
  // }

  // function farmUndelegate(uint256 amount) external {
  //   address farmDistributor = IAddressProvider(_addressProvider).getFarmDistributor();
  //   IDistributor(farmDistributor).undelegate(amount);
  // }
}
