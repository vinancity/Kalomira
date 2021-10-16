import '@openzeppelin/hardhat-upgrades';
import 'hardhat-contract-sizer';
import '@nomiclabs/hardhat-waffle';
import '@typechain/ethers-v5';
import '@typechain/hardhat';
import 'hardhat-deploy';
import 'solidity-coverage';

import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
      accounts: [
        {
          privateKey: process.env.LOCAL_PRIVATE_KEY_1,
          balance: '10000000000000000000000',
        },
        {
          privateKey: process.env.LOCAL_PRIVATE_KEY_2,
          balance: '10000000000000000000000',
        },
        {
          privateKey: process.env.LOCAL_PRIVATE_KEY_3,
          balance: '10000000000000000000000',
        },
        // {
        //   privateKey: process.env.LOCAL_PRIVATE_KEY_4,
        //   balance: '10000000000000000000000',
        // },
      ],
    },
    // testnet: {
    //   url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    //   chainId: 97,
    //   gasPrice: 20000000000,
    //   accounts: [process.env.BSC_TESTNET_PRIVATE_KEY],
    // },
    // mainnet: {
    //   url: process.env.BSC_MAINNET_RPC,
    //   accounts: [process.env.BSC_MAINNET_PRIVATE_KEY],
    // },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  solidity: {
    version: '0.8.2',
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
      evmVersion: 'istanbul',
      outputSelection: {
        '*': {
          '': ['ast'],
          '*': [
            'evm.bytecode.object',
            'evm.deployedBytecode.object',
            'abi',
            'evm.bytecode.sourceMap',
            'evm.deployedBytecode.sourceMap',
            'metadata',
          ],
        },
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  typechain: {
    outDir: './typechain',
    target: 'ethers-v5',
  },
};
