const { BigNumber } = require("ethers")

const BASE_TEN = 10
function getBigNumber(amount, decimals = 18) {
    return BigNumber.from(amount).mul(BigNumber.from(BASE_TEN).pow(decimals))
}

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let deployments = [];

  const Kalomira = await ethers.getContractFactory("Kalomira");
  let kal_token = await Kalomira.deploy();
  await kal_token.deployed();
  deployments.push({name: "Kalomira", addr: kal_token.address});
  console.log(deployments[0].name, deployments[0].addr);
  
  const Kardia = await ethers.getContractFactory("KardiachainToken");
  let kai_token = await Kardia.deploy();
  await kai_token.deployed();
  deployments.push({name: "Kardia", addr: kai_token.address});
  console.log(deployments[1].name, deployments[1].addr);

  const ibKAI = await ethers.getContractFactory("ibKAI");
  const deposit = ethers.utils.parseEther("5");
  const initialSupply = ethers.utils.parseEther("100");
  let ibkai_token = await ibKAI.deploy(deposit, initialSupply);
  await ibkai_token.deployed( );
  deployments.push({name: "ibKAI", addr: ibkai_token.address});
  console.log(deployments[2].name, deployments[2].addr);

  const TokenFarm = await ethers.getContractFactory("TokenFarm");
  let farm = await TokenFarm.deploy(ibkai_token.address, kal_token.address);
  await farm.deployed();
  deployments.push({name: "TokenFarm", addr: farm.address});
  console.log(deployments[3].name, deployments[3].addr);

  await kal_token._transferOwnership(farm.address);


  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(deployments);
}

async function main_v2(){
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }
    const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let deployments = [];
  
  const Kalomira = await ethers.getContractFactory("Kalomira");
  kaloToken = await Kalomira.deploy();
  await kaloToken.deployed();
  deployments.push({name: "Kalomira", addr: kaloToken.address});
  console.log(deployments[0].name, deployments[0].addr);

  const ibKAI = await ethers.getContractFactory("ibKAI");
  const deposit = ethers.utils.parseEther("10");
  const initialSupply = ethers.utils.parseEther("100");
  let ibkaiToken = await ibKAI.deploy(deposit, initialSupply);
  await ibkaiToken.deployed();
  deployments.push({name: "ibKAI", addr: ibkaiToken.address});
  console.log(deployments[1].name, deployments[1].addr);

  const LP1 = await ethers.getContractFactory("MockLP");
  lp1 = await LP1.deploy("ibKAI-KALO", "LP1", getBigNumber(100));
  await lp1.deployed();
  deployments.push({name: "MockLP1", addr: lp1.address});
  console.log(deployments[2].name, deployments[2].addr);

  const LP2 = await ethers.getContractFactory("MockLP");
  lp2 = await LP2.deploy("ibKAI-DOGE", "LP2", getBigNumber(100));
  await lp2.deployed();
  deployments.push({name: "MockLP2", addr: lp2.address});
  console.log(deployments[3].name, deployments[3].addr);

  const LP3 = await ethers.getContractFactory("MockLP");
  lp3 = await LP3.deploy("ibKAI-TEST", "LP3", getBigNumber(100));
  await lp3.deployed();
  deployments.push({name: "MockLP3", addr: lp3.address});
  console.log(deployments[4].name, deployments[4].addr);

  // 100 KALO per block starting at block 100 with bonus until block 1000
  const MasterChef = await ethers.getContractFactory("MasterChef");
  let owner = await deployer.getAddress();
  masterchef = await MasterChef.deploy(kaloToken.address, owner, 100, 0, 1000);
  await masterchef.deployed();
  deployments.push({name: "MasterChef", addr: masterchef.address});
  console.log(deployments[5].name, deployments[5].addr);

  await kaloToken._transferOwnership(masterchef.address);
  await masterchef.add(20, lp1.address, true);
  await masterchef.add(10, lp2.address, true);
  await masterchef.add(10, lp3.address, true);


  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(deployments);
}

function saveFrontendFiles(deployments) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ [deployments[0].name]: deployments[0].addr, 
                     [deployments[1].name]: deployments[1].addr,
                     [deployments[2].name]: deployments[2].addr,
                     [deployments[3].name]: deployments[3].addr,
                     [deployments[4].name]: deployments[4].addr,
                     [deployments[5].name]: deployments[5].addr}, undefined, 2),
  );

  const KalomiraArtifact = artifacts.readArtifactSync("Kalomira");
  fs.writeFileSync(
    contractsDir + "/Kalomira.json",
    JSON.stringify(KalomiraArtifact, null, 2)
  );

  const ibKAIArtifact = artifacts.readArtifactSync("ibKAI");
  fs.writeFileSync(
    contractsDir + "/ibKAI.json",
    JSON.stringify(ibKAIArtifact, null, 2)
  );

  const MockLPArtifact = artifacts.readArtifactSync("MockLP");
  fs.writeFileSync(
    contractsDir + "/MockLP.json",
    JSON.stringify(MockLPArtifact, null, 2)
  );

  const MasterChefArtifact = artifacts.readArtifactSync("MasterChef");
  fs.writeFileSync(
    contractsDir + "/MasterChef.json",
    JSON.stringify(MasterChefArtifact, null, 2)
  );

  const TokenFarmArtifact = artifacts.readArtifactSync("TokenFarm");
  fs.writeFileSync(
    contractsDir + "/TokenFarm.json",
    JSON.stringify(TokenFarmArtifact, null, 2)
  );
}

main_v2()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
