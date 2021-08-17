// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IFeeStructure.sol";
import "./interfaces/IInterestBearingToken.sol";

contract FeeStructureState {
    address _allocator;

    /**
    * @dev Minting/Redeeming fee reward to team.
    */
    address _devAddress;

    /**
    * @dev Fee accrue for KALOS staking treasury
    */
    address _treasuryAddress;

    /**
    * @dev Interest bearing token contract
    */
    address _ibKAI;

    uint _mintFee;
    uint _redeemFee;
    uint _treasuryCommisionRate;
}

contract FeeStructure is 
    IFeeStructure,
    FeeStructureState,
    OwnableUpgradeable
{
    using SafeMath for uint256;

    function initialize(
        address ibKAI_,
        address allocator_,
        address devAddress_,
        address treasuryAddress_
    ) external initializer {
        OwnableUpgradeable.__Ownable_init();
        _mintFee = 200; // 0.2%
        _redeemFee = 400; // 0.4%
        _treasuryCommisionRate = 8000; // 80%
        _ibKAI = ibKAI_;
        _allocator = allocator_;
        _devAddress = devAddress_;
        _treasuryAddress = treasuryAddress_;
    }

    // Admin functions

    function setMintFee(uint _basisPointRatio) external onlyOwner {
        _mintFee = _basisPointRatio;
    }

    function setRedeemFee(uint _basisPointRatio) external onlyOwner {
        _redeemFee = _basisPointRatio;
    }

    function setTreasuryCommision(uint _basisPointRatio) external onlyOwner {
        _treasuryCommisionRate = _basisPointRatio;
    }


    // Contract only functions
    function chargeFee(uint amount, bool isMintOrRedeem) external override {
        uint feeAmount = amount.div(10000).mul(isMintOrRedeem ? _mintFee : _redeemFee);
        uint _treasuryCommision = feeAmount.mul(_treasuryCommisionRate).div(10000);
        uint _devCommision = feeAmount.sub(_treasuryCommision);
        IERC20(_ibKAI).transferFrom(_allocator, _treasuryAddress, _treasuryCommision);
        IERC20(_ibKAI).transferFrom(_allocator, _devAddress, _devCommision);
    }

    function mintFee() external view override returns (uint) {
        return _mintFee;
    }

    function redeemFee() external view override returns (uint) {
        return _redeemFee;
    }

    function _getMintFeeAmount(uint amount) internal {}
}