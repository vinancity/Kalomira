
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
                     [deployments[3].name]: deployments[3].addr}, undefined, 2),
  );

  const KalomiraArtifact = artifacts.readArtifactSync("Kalomira");
  fs.writeFileSync(
    contractsDir + "/Kalomira.json",
    JSON.stringify(KalomiraArtifact, null, 2)
  );

  const KardiaArtifact = artifacts.readArtifactSync("KardiachainToken");
  fs.writeFileSync(
    contractsDir + "/Kardia.json",
    JSON.stringify(KardiaArtifact, null, 2)
  );

  const ibKAIArtifact = artifacts.readArtifactSync("ibKAI");
  fs.writeFileSync(
    contractsDir + "/ibKAI.json",
    JSON.stringify(ibKAIArtifact, null, 2)
  );

  const FarmArtifact = artifacts.readArtifactSync("TokenFarm");
  fs.writeFileSync(
    contractsDir + "/TokenFarm.json",
    JSON.stringify(FarmArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
