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
    
    const contractsDir = __dirname + "/../frontend/src/contracts";

    if (!fs.existsSync(contractsDir)) {
        console.log("DNE")
    }

    let path = contractsDir + "/Kalomira.json"; 
    let rawdata = fs.readFileSync(path);
    let contract = JSON.parse(rawdata);
    const kal_token = await deployKardiaContract(contract, [], "Kalomira");

    /*
    path = contractsDir + "/Kardia.json";
    rawdata = fs.readFileSync(path);
    contract = JSON.parse(rawdata);
    const kai_token = await deployKardiaContract(contract, [], "KardiachainToken");*/

    path = contractsDir + "/ibKAI.json";
    rawdata = fs.readFileSync(path);
    contract = JSON.parse(rawdata);    
    const deposit = 5000000000000000000;
    const initialSupply = 100000000000000000000;
    const ibKAI_token = await deployKardiaContract(contract, [deposit, initialSupply], "ibKAI");

    path = contractsDir + "/TokenFarm.json";
    rawdata = fs.readFileSync(path);
    contract = JSON.parse(rawdata);
    const farm = await deployKardiaContract(contract, [ibKAI_token.address, kal_token.address], "TokenFarm");

}

async function main_v2(){
    const contractsDir = __dirname + "/../frontend/src/contracts";

    if (!fs.existsSync(contractsDir)) {
        console.log("DNE")
    }
}

async function test() {   
    const fs = require("fs");
    const contractsDir = __dirname + "/../frontend/src/contracts"
    var Web3 = require('web3');
    var url = 'https://mainnet.infura.io/v3/7aa637dfc4e94d22bfdfe3b1f4401daf';
    var web3 = new Web3(url);

    let path = contractsDir + "/Kalomira.json"; 
    let rawdata = fs.readFileSync(path);
    let contract = JSON.parse(rawdata);
    
    const kal_token = new web3.eth.Contract(contract.abi, contractAddr);
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    console.error("ERROR")
    process.exit(1);
  });