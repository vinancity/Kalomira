const { default: KardiaClient } = require('kardia-js-sdk');
const { join } = require('path');
const fs = require('fs');
require('dotenv').config();

async function main1() {
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
  /**
   * Deployment tasks
   */
  await smcKLS.transferOwnership(smcTreasury.address);
  await smcIbKAI.transferOwnership(smcFactory.address);
  await smcTreasury.resetWeek(0);
  // mint 2.5 billion KALO to masterchef for farming
  return protocolContracts;
}

const _privateKey = process.env.PRIVATE_KEY;
const _wallet = process.env.PUBLIC_KEY;
const _kardiaRPC = process.env.KARDIA_RPC;
const _kardiaClient = new KardiaClient({ endpoint: _kardiaRPC });

const deployKardiaContract = async (contract, params = [], contractName) => {
  const privateKey = _privateKey;
  const kardiaClient = new KardiaClient({ endpoint: _kardiaRPC });
  const contractInstance = kardiaClient.contract;
  contractInstance.updateAbi(contract.abi);
  contractInstance.updateByteCode(contract.bytecode);

  const maxGasLimit = 8000000;
  const preDeploy = contractInstance.deploy({
    params,
  });
  const defaultPayload = await preDeploy.getDefaultTxPayload();
  const estimateGas = await preDeploy.estimateGas(defaultPayload);

  const nonce = await kardiaClient.account.getNonce(_wallet);
  //const estimateGas = 20000000;
  console.log(`Deploying ${contractName}: ${estimateGas} estimateGas`);

  const smcData = await preDeploy.send(
    privateKey,
    {
      gas: maxGasLimit,
      nonce,
    },
    true
  );

  console.log(`Deployed ${contractName} at ${smcData.contractAddress}`);

  const result = {
    ...smcData,
    contractName,
    address: smcData.contractAddress,
    contract: contractInstance,
  };

  // Write contract deployment to local
  const writeData = {
    contractAddress: smcData.contractAddress,
    bytecode: contract.bytecode,
    abi: JSON.stringify(contract.abi),
  };
  console.log(__dirname);
  const dir = __dirname + '/../deployments';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    if (!fs.existsSync(dir + '/testnet')) {
      fs.mkdirSync(dir + '/testnet');
    }
  }
  // const writePath = join(__dirname, '../deployments/mainnet', `${contractName}.json`);
  const writePath = join(__dirname, '../deployments/testnet', `${contractName}.json`);
  fs.writeFileSync(writePath, JSON.stringify(writeData, null, 2), { encoding: 'utf-8' });
  return result;
};

async function getContractArtifact(dir, contractName) {
  const contractsDir = '../artifacts/contracts';
  const path = join(__dirname, contractsDir, dir, contractName + '.sol', contractName + '.json');
  const rawdata = fs.readFileSync(path);
  const artifact = JSON.parse(rawdata);
  return artifact;
}

async function initialize(deployedContract, calldata = [], waitUntilMined = true) {
  const invocation = deployedContract.contract.invokeContract('initialize', calldata);
  const nonce = await _kardiaClient.account.getNonce(_wallet);
  const tx = await invocation.send(_privateKey, deployedContract.address, { gas: 3000000, nonce }, waitUntilMined);
  console.log('initialize', deployedContract.contractName, { tx, calldata }, '\n\r');
  return tx;
}

async function invoke(deployedContract, method, calldata, waitUntilMined = true) {
  const invocation = deployedContract.contract.invokeContract(method, calldata);
  const nonce = await _kardiaClient.account.getNonce(_wallet);
  const tx = await invocation.send(_privateKey, deployedContract.address, { gas: 3000000, nonce }, waitUntilMined);
  console.log('invoke smc:', deployedContract.contractName, { method, calldata, tx });
  return tx;
}

async function main2() {
  /**
   * Deploy and intialize contracts
   */
  const AddressProvider = await getContractArtifact('protocol/address', 'AddressProvider');
  const smcAddressProvider = await deployKardiaContract(AddressProvider, [], 'AddressProvider');
  await initialize(smcAddressProvider);

  const Factory = await getContractArtifact('protocol/factory', 'Factory');
  const smcFactory = await deployKardiaContract(Factory, [], 'Factory');
  await initialize(smcFactory, [smcAddressProvider.address]);

  const FeeProvider = await getContractArtifact('protocol/fee', 'FeeProvider');
  const smcFeeProvider = await deployKardiaContract(FeeProvider, [], 'FeeProvider');
  await initialize(smcFeeProvider, [smcAddressProvider.address]);

  const Treasury = await getContractArtifact('protocol/treasury', 'Treasury');
  const smcTreasury = await deployKardiaContract(Treasury, [], 'Treasury');
  await initialize(smcTreasury, [smcAddressProvider.address]);

  const KLS = await getContractArtifact('token', 'KLS');
  const smcKLS = await deployKardiaContract(KLS, [], 'KLS');
  // no init

  const Kalos = await getContractArtifact('token', 'Kalos');
  const smcKalos = await deployKardiaContract(Kalos, [], 'KLS');
  // no init

  const IbKAI = await getContractArtifact('token', 'IBKAIToken');
  const smcIbKAI = await deployKardiaContract(IbKAI, [], 'ibKAI');
  await initialize(smcIbKAI, [smcAddressProvider.address]);

  const MasterChef = await getContractArtifact('farm', 'MasterChef');
  const smcMasterchef = await deployKardiaContract(MasterChef, [], 'Masterchef');
  // no init

  // Set addresses
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

  const ethers = require('ethers');
  // wire addresses
  for (const key in protocolContracts) {
    const inputs = [ethers.utils.formatBytes32String(key), protocolContracts[key]];
    if (protocolContracts[key] != '') {
      await invoke(smcAddressProvider, 'setAddress', inputs, true);
    }
  }
  protocolContracts['ADDRESS_PROVIDER'] = smcAddressProvider.address;
  console.log(JSON.stringify(protocolContracts, null, 2));

  /**
   * Deployment tasks
   */
  await invoke(smcKLS, 'transferOwnership', [smcTreasury.address]);
  await invoke(smcIbKAI, 'transferOwnership', [smcFactory.address]);
  await invoke(smcTreasury, 'resetWeek', [0]);

  return protocolContracts;
}

async function main(deployLocal = true, deployTestnet = false) {
  const contractAddresses = {
    KALOS_TOKEN: {},
    IBKAI_TOKEN: {},
    KLS_TOKEN: {},
    WKAI_TOKEN: {},
    USDT_TOKEN: {},
    FEE_PROVIDER: {},
    FACTORY: {},
    DISTRIBUTOR: {},
    EPOCH: {},
    FARM_DISTRIBUTOR: {},
    MASTER_CHEF: {},
    TREASURY: {},
    VALIDATOR: {},
    VOLUME_COUNTER: {},
    DEX_ROUTER: {},
    DEX_FACTORY: {},
  };
  var localAddresses = {};
  if (deployLocal) {
    localAddresses = await main1();
  }
  var testnetAddresses = {};
  if (deployTestnet) {
    testnetAddresses = await main2();
  }

  for (key in contractAddresses) {
    contractAddresses[key]['31337'] = localAddresses[key] || '';
    contractAddresses[key]['0'] = testnetAddresses[key] || '';
  }

  console.log(JSON.stringify(contractAddresses, null, 2));
  const writePath = join(__dirname, '../deployments/testnet', `contractAddresses.json`);
  fs.writeFileSync(writePath, JSON.stringify(contractAddresses, null, 2), { encoding: 'utf-8' });

  const tsPath = join(__dirname, '../deployments/testnet', `contracts.ts`);
  fs.writeFileSync(tsPath, `export default ${JSON.stringify(contractAddresses, null, 2)}`, { encoding: 'utf-8' });
}
main(1, 0)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    console.error('ERROR');
    process.exit(1);
  });
