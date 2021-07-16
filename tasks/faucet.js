//const { ethers } = require("ethers");
const fs = require("fs");
const { parse } = require("path");

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

    const token = await ethers.getContractAt("Kalomira", address.Kalomira);
    const token1 = await ethers.getContractAt("KardiachainToken", address.Kardia);
    const [sender] = await ethers.getSigners();

    const numTokens = 5;
/*
    const tx = await token.mint(receiver, ethers.utils.parseEther(numTokens.toString()));
    await tx.wait();*/

    const tx1 = await token1.transfer(receiver, ethers.utils.parseEther(numTokens.toString()));
    await tx1.wait();

    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx2.wait();

    console.log(`Transferred 1 ETH, ${numTokens} KAL, and ${numTokens} KAI to ${receiver}`);
  });