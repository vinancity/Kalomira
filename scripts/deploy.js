// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
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

  let Token = await ethers.getContractFactory("Kalomira");
  let token = await Token.deploy();
  await token.deployed();

  deployments.push({name: "Kalomira", addr: token.address});
  console.log(deployments[0].name, deployments[0].addr);
  

  Token = await ethers.getContractFactory("KardiachainToken");
  token = await Token.deploy();
  await token.deployed();

  deployments.push({name: "Kardia", addr: token.address});
  console.log(deployments[1].name, deployments[1].addr);
/*
  Token = await ethers.getContractFactory("TokenFarm");
  token = await Token.deploy();
  await token.deployed();

  deployments.push({name: "TokenFarm", addr: token.address});
  console.log(deployments[2].name, deployments[2].addr);
*/

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token, deployments);
}

function saveFrontendFiles(token, deployments) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ [deployments[0].name]: deployments[0].addr, 
                     [deployments[1].name]: deployments[1].addr,
                     /*[deployments[2].name]: deployments[2].addr*/ }, undefined, 2),
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
/*
  const FarmArtifact = artifacts.readArtifactSync("TokenFarm");
  fs.writeFileSync(
    contractsDir + "/TokenFarm.json",
    JSON.stringify(FarmArtifact, null, 2)
  );*/
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
