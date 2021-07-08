require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

module.exports = {
  solidity: "0.8.4",
  network: {
    localhost: {
      url: "http://localhost:6745",
      chainId: 31337,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
    },
  },
};
