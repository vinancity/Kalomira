import "@openzeppelin/test-helpers";
import contracts from "../frontend/src/config/constants/contracts";

import { Kalos__factory, Treasury__factory } from "../typechain";
import { network, ethers } from "hardhat";

async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are running the faucet task with Hardhat network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const kalo = contracts.KALOS_TOKEN["31337"];
  const treasury = contracts.TREASURY["31337"];

  const [sender] = await ethers.getSigners();

  const kaloAsDeployer = Kalos__factory.connect(kalo, sender);
  await kaloAsDeployer.mint("0xa47d913c5CAB3B965784e75924BFf115eA15C1CB", ethers.utils.parseEther("7.5"));
  const treasuryAsDeployer = Treasury__factory.connect(treasury, sender);
  await treasuryAsDeployer.resetWeek(0);
  await treasuryAsDeployer.mintKLS("0xa47d913c5CAB3B965784e75924BFf115eA15C1CB", ethers.utils.parseEther("5"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
