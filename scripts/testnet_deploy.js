const { default: KardiaClient } = require("kardia-js-sdk");
const { BigNumber } = require("bignumber.js");

BigNumber.config({
  EXPONENTIAL_AT: 1e9,
  DECIMAL_PLACES: 80,
});

const getHexFromNum = (number) => {
  const TOKEN_DECIMALS = new BigNumber(10).pow(18);
  const bigNum = new BigNumber(number).times(TOKEN_DECIMALS);
  const hexStr = bigNum.toString(16);
  return "0x" + hexStr;
};

const _privateKey = "0xc7b518d8fdfc3046c463e71031dc2edddc2e7a93fd1dc0e130b7f84944fe19b7";

const deployKardiaContract = async (contract, params = [], contractName) => {
  const kardiaRPC = "https://dev-1.kardiachain.io";
  const privateKey = _privateKey;

  const kardiaClient = new KardiaClient({ endpoint: kardiaRPC });

  const contractInstance = kardiaClient.contract;
  kardiaClient.contract.updateAbi(contract.abi);
  kardiaClient.contract.updateByteCode(contract.bytecode);

  const maxGasLimit = 8000000;
  const preDeploy = contractInstance.deploy({
    params,
  });
  const defaultPayload = await preDeploy.getDefaultTxPayload();
  const estimateGas = await preDeploy.estimateGas(defaultPayload);

  //const estimateGas = 20000000;
  console.log(`Deploying ${contractName}: ${estimateGas} estimateGas`);

  const smcData = await preDeploy.send(
    privateKey,
    {
      gas: maxGasLimit,
    },
    true
  );

  console.log(`Deployed ${contractName} at ${smcData.contractAddress}`);

  return {
    ...smcData,
    address: smcData.contractAddress,
    contract: contractInstance,
  };
};

async function main() {
  const fs = require("fs");
  const contractsDir = __dirname + "/contracts";

  if (!fs.existsSync(contractsDir)) {
    console.log("DNE");
  }

  let path = contractsDir + "/Kalomira.json";
  let rawdata = fs.readFileSync(path);
  let contract = JSON.parse(rawdata);
  const kal_token = await deployKardiaContract(contract, [], "Kalomira");
  // let invocation = kal_token.contract.invokeContract("mint", [
  //   "0x6a66d06332a1ed6a3807298C9Ca81a51e318F846",
  //   getHexFromNum(100),
  // ]);
  // let res = await invocation.send(_privateKey, kal_token.address);
  // console.log("Tx: ", res);

  path = contractsDir + "/ibKAI.json";
  rawdata = fs.readFileSync(path);
  contract = JSON.parse(rawdata);
  const deposit = getHexFromNum(10);
  const initialSupply = getHexFromNum(100);
  const ibKAI_token = await deployKardiaContract(contract, [deposit, initialSupply], "ibKAI");

  path = contractsDir + "/MockLP.json";
  rawdata = fs.readFileSync(path);
  contract = JSON.parse(rawdata);
  const lp1_token = await deployKardiaContract(contract, ["ibKAI-KALO", "LP1", initialSupply], "LP1");

  path = contractsDir + "/MockLP.json";
  rawdata = fs.readFileSync(path);
  contract = JSON.parse(rawdata);
  const lp2_token = await deployKardiaContract(contract, ["ibKAI-DOGE", "LP2", initialSupply], "LP2");

  path = contractsDir + "/MockLP.json";
  rawdata = fs.readFileSync(path);
  contract = JSON.parse(rawdata);
  const lp3_token = await deployKardiaContract(contract, ["ibKAI-TEST", "LP3", initialSupply], "LP3");

  path = contractsDir + "/Multicall.json";
  rawdata = fs.readFileSync(path);
  contract = JSON.parse(rawdata);
  const multicall = await deployKardiaContract(contract, [], "Multicall");

  path = contractsDir + "/MasterChef.json";
  rawdata = fs.readFileSync(path);
  contract = JSON.parse(rawdata);
  const kaloPerBlock = getHexFromNum(100);
  const masterchef = await deployKardiaContract(
    contract,
    [kal_token.address, "0xa47d913c5cab3b965784e75924bff115ea15c1cb", kaloPerBlock, 0, 1000],
    "Masterchef"
  );

  let invocation = kal_token.contract.invokeContract("_transferOwnership", [masterchef.address]);
  let res = await invocation.send(_privateKey, kal_token.address);
  console.log(res);

  invocation = masterchef.contract.invokeContract("add", [20, lp1_token.address, true]);
  res = await invocation.send(_privateKey, masterchef.address);

  invocation = masterchef.contract.invokeContract("add", [10, lp2_token.address, true]);
  res = await invocation.send(_privateKey, masterchef.address);

  invocation = masterchef.contract.invokeContract("add", [10, lp3_token.address, true]);
  res = await invocation.send(_privateKey, masterchef.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    console.error("ERROR");
    process.exit(1);
  });
