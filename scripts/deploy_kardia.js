const {
  default: KardiaClient,
  KardiaAccount,
  KAIChain,
} = require("kardia-js-sdk");
// const { ethers } = require("ethers");
const { join } = require("path");
const fs = require("fs");
const { ethers } = require("ethers");

function saveFrontendFiles(deployments) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const ibKAIArtifact = artifacts.readArtifactSync("ibKAI");
  fs.writeFileSync(
    contractsDir + "/ibKAI.json",
    JSON.stringify(ibKAIArtifact, null, 2)
  );

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify(deployments, undefined, 2)
  );
}

const deployKardiaContract = async (contract, params = [], value) => {
  const kardiaRPC = "https://dev-1.kardiachain.io";
  const privateKey =
    "0x1a76f1e878b16df043fd2a81f6c08e7d1cfb90da809646f85f63c343c58498cd";

  const kardiaClient = new KardiaClient({ endpoint: kardiaRPC });

  const contractInstance = kardiaClient.contract;
  console.log(JSON.stringify(contract, null, 2));
  contractInstance.updateAbi(contract.abi);
  contractInstance.updateByteCode(contract.bytecode);

  const maxGasLimit = 8000000;
  const preDeploy = contractInstance.deploy({
    params,
  });
  const defaultPayload = await preDeploy.getDefaultTxPayload();
  const estimateGas = await preDeploy.estimateGas(defaultPayload);

  const smcData = await preDeploy.send(
    privateKey,
    {
      gas: maxGasLimit,
    },
    true
  );

  console.log(`Deployed at ${smcData.contractAddress}`);

  return {
    ...smcData,
    address: smcData.contractAddress,
  };
};

async function main() {
  path = join(__dirname, "../artifacts/contracts/ibKAI.sol/ibKAI.json");
  rawdata = fs.readFileSync(path);
  contract = JSON.parse(rawdata);
  const initialSupply = ethers.utils.parseEther("100", "ether");

  const deployments = {};

  console.log(`Deploying...`);
  const ibKAI_token = await deployKardiaContract(
    contract,
    [initialSupply],
    initialSupply
  );
  deployments["ibKAI"] = ibKAI_token.address;

  console.log(`Deployed ${ibKAI_token.address}`);

  saveFrontendFiles(deployments);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    console.error("ERROR");
    process.exit(1);
  });
