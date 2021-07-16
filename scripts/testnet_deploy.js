const { default: KardiaClient, KardiaAccount, KAIChain } = require("kardia-js-sdk");
const { ethers } = require("ethers")

const deployKardiaContract = async (contract, params = [], contractName) => {
    const kardiaRPC = "https://dev-1.kardiachain.io";
    const privateKey =
    "0xc7b518d8fdfc3046c463e71031dc2edddc2e7a93fd1dc0e130b7f84944fe19b7";
    
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
    };
};


async function main(){
    const fs = require("fs");
    const contractsDir = __dirname + "/../frontend/src/contracts";

    if (!fs.existsSync(contractsDir)) {
        console.log("DNE")
    }

    let path = contractsDir + "/Kalomira.json"; 
    let rawdata = fs.readFileSync(path);
    let contract = JSON.parse(rawdata);
    const kal_token = await deployKardiaContract(contract, [], "Kalomira");

    path = contractsDir + "/Kardia.json";
    rawdata = fs.readFileSync(path);
    contract = JSON.parse(rawdata);
    const kai_token = await deployKardiaContract(contract, [], "KardiachainToken");

    path = contractsDir + "/TokenFarm.json";
    rawdata = fs.readFileSync(path);
    contract = JSON.parse(rawdata);
    const farm = await deployKardiaContract(contract, [kai_token.address, kal_token.address], "TokenFarm");

}

async function deployContract() {
    const kardiaClient = new KardiaClient({ endpoint: "https://dev-1.kardiachain.io" })
    //console.log(await kardiaClient.account.getBalance("0xa47d913c5CAB3B965784e75924BFf115eA15C1CB"))

    const fs = require("fs");
    const contractsDir = __dirname + "/../frontend/src/contracts";

    if (!fs.existsSync(contractsDir)) {
        console.log("DNE")
    }

    let path = contractsDir + "/Kalomira.json"; 
    let rawdata = fs.readFileSync(path);
    let contract = JSON.parse(rawdata);

    const contractInstance = kardiaClient.contract;
    contractInstance.updateAbi(contract.abi)
    contractInstance.updateByteCode(contract.bytecode)

    const preDeploy = contractInstance.deploy({ params: [], })
    const defaultPayload = preDeploy.getDefaultTxPayload();

    const maxGasLimit = 8000000;
    const estimatedGas = await preDeploy.estimateGas(defaultPayload);
    console.log(`Deploying ${"Kalomira"}: ${estimatedGas} estimateGas`);
    
    const smcData = await preDeploy.send(
        "0xc7b518d8fdfc3046c463e71031dc2edddc2e7a93fd1dc0e130b7f84944fe19b7", 
    {
        gas: maxGasLimit,
    })
    console.log(smcData.contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    console.error("ERROR")
    process.exit(1);
  });