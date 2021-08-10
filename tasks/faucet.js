//const { ethers } = require("ethers");
const fs = require("fs");
const { parse } = require("path");
const { BigNumber } = require("ethers")

const BASE_TEN = 10
function getBigNumber(amount, decimals = 18) {
    return BigNumber.from(amount).mul(BigNumber.from(BASE_TEN).pow(decimals))
}

task("faucet", "Sends ETH and tokens to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile =
      __dirname + "/../frontend/src/contracts/contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);
    
    if ((await ethers.provider.getCode(address.Kalomira)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    //const token = await ethers.getContractAt("Kalomira", address.Kalomira);
    //const ibkaiToken = await ethers.getContractAt("ibKAI", address.ibKAI);
    const lp1 = await ethers.getContractAt("MockLP", address.MockLP1);
    const lp2 = await ethers.getContractAt("MockLP", address.MockLP2);
    const lp3 = await ethers.getContractAt("MockLP", address.MockLP3);

    const [sender] = await ethers.getSigners();

    const numTokens = 10;
/*
    const tx = await token.mint(receiver, ethers.utils.parseEther(numTokens.toString()));
    await tx.wait();*/

    // const tx0 = await ibkaiToken.transfer(receiver, getBigNumber(numTokens));
    // await tx0.wait();

    const tx1 = await lp1.connect(sender).transfer(receiver, getBigNumber(numTokens));
    await tx1.wait();

    const tx2 = await lp2.connect(sender).transfer(receiver, getBigNumber(numTokens));
    await tx2.wait();

    const tx3 = await lp3.connect(sender).transfer(receiver, getBigNumber(numTokens));
    await tx3.wait();
//
    const tx4 = await sender.sendTransaction({
      to: receiver,
      value: getBigNumber(numTokens),
    });
    await tx4.wait();

    console.log(`Transferred 1 ETH,  ${numTokens} MockLP1, ${numTokens} MockLP2, ${numTokens} MockLP3 to ${receiver}`);
  });