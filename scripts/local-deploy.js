const { join } = require('path');
const fs = require('fs');
const { ethers } = require('hardhat');

async function main() {
  if (network.name === 'hardhat') {
    console.warn(
      'You are trying to deploy a contract to the Hardhat Network, which' +
        'gets automatically created and destroyed every time. Use the Hardhat' +
        " option '--network localhost'"
    );
  }
  const [deployer] = await ethers.getSigners();

  console.log('Deploying the contracts with the account:', await deployer.getAddress());

  console.log('Account balance:', (await deployer.getBalance()).toString());
  ethers.utils.formatBytes32String('');

  // const Multicall = await ethers.getContractFactory('Multicall');
  // let multicall = await Multicall.deploy();
  // await multicall.deployed();
  // deployments.push({ name: 'Multicall', addr: multicall.address });
  // console.log(deployments[x].name, deployments[x].addr);
  // x++;

  const AddressProvider = await ethers.getContractFactory('AddressProvider');
  const smcAddressProvider = await AddressProvider.deploy();
  await smcAddressProvider.deployed();
  await smcAddressProvider.initialize();

  const Factory = await ethers.getContractFactory('Factory');
  const smcFactory = await Factory.deploy();
  await smcFactory.deployed();
  await smcFactory.initialize(smcAddressProvider.address);

  const FeeProvider = await ethers.getContractFactory('FeeProvider');
  const smcFeeProvider = await FeeProvider.deploy();
  await smcFeeProvider.deployed();
  await smcFeeProvider.initialize(smcAddressProvider.address);

  const Treasury = await ethers.getContractFactory('Treasury');
  const smcTreasury = await Treasury.deploy();
  await smcTreasury.deployed();
  await smcTreasury.initialize(smcAddressProvider.address);

  const KLS = await ethers.getContractFactory('KLS');
  const smcKLS = await KLS.deploy();
  await smcKLS.deployed();

  const Kalos = await ethers.getContractFactory('Kalos');
  const smcKalos = await Kalos.deploy();
  await smcKalos.deployed();

  const IbKAI = await ethers.getContractFactory('IBKAIToken');
  const smcIbKAI = await IbKAI.deploy();
  await smcIbKAI.deployed();
  await smcIbKAI.initialize(smcAddressProvider.address);

  const MasterChef = await ethers.getContractFactory('MasterChef');
  const smcMasterchef = await MasterChef.deploy(
    smcKalos.address,
    await deployer.getAddress(),
    ethers.utils.parseEther('100'),
    0,
    1000
  );
  await smcMasterchef.deployed();

  // const LP1 = await ethers.getContractFactory('MockLP');
  // lp1 = await LP1.deploy('ibKAI-KALO', 'LP1', getBigNumber(100));
  // await lp1.deployed();

  // await kaloToken._transferOwnership(masterchef.address);
  // await masterchef.add(20, lp1.address, true);
  // await masterchef.add(10, lp2.address, true);
  // await masterchef.add(10, lp3.address, true);

  const protocolContracts = {
    KALOS_TOKEN: smcKalos.address,
    IBKAI_TOKEN: smcIbKAI.address,
    KLS_TOKEN: smcKLS.address,
    WKAI_TOKEN: '',
    USDT_TOKEN: '',
    FEE_PROVIDER: smcFeeProvider.address,
    FACTORY: smcFactory.address,
    DISTRIBUTOR: '',
    EPOCH: '',
    FARM_DISTRIBUTOR: '',
    MASTER_CHEF: smcMasterchef.address,
    TREASURY: smcTreasury.address,
    VALIDATOR: '',
    VOLUME_COUNTER: '',
    DEX_ROUTER: '',
    DEX_FACTORY: '',
  };
  for (const key in protocolContracts) {
    // const inputs = [ethers.utils.formatBytes32String(key), protocolContracts[key]];
    if (protocolContracts[key] != '') {
      await smcAddressProvider.setAddress(ethers.utils.formatBytes32String(key), protocolContracts[key]);
    }
  }

  protocolContracts['ADDRESS_PROVIDER'] = smcAddressProvider.address;
  console.log(JSON.stringify(protocolContracts, null, 2));
  return protocolContracts;
}

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
