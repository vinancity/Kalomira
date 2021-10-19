import "@openzeppelin/test-helpers";

import { Kalos__factory } from "../typechain";
import { network, ethers } from "hardhat";
import fs from "fs";

async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are running the faucet task with Hardhat network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const addressesFile = __dirname + "/../frontend/src/config/constants/contracts.json";

  if (!fs.existsSync(addressesFile)) {
    console.error("You need to deploy your contract first");
    return;
  }

  const addressJson = fs.readFileSync(addressesFile);
  const address = JSON.parse(addressJson.toString());

  const kalo = address["KALOS_TOKEN"]["31337"];
  console.log(kalo);

  const [sender] = await ethers.getSigners();

  const deployer = Kalos__factory.connect(kalo, sender);
  await deployer.mint("0xf5ED67Ca714A69C241a3eA5C7AFB7C07E30aF480", ethers.utils.parseEther("7.5"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
