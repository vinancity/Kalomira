const fs = require("fs");
const { parse } = require("path");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

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

    const numTokens = 15;

    const tx = await token.transfer(receiver, numTokens);
    await tx.wait();

    const tx1 = await token1.transfer(receiver, numTokens);
    await tx1.wait();

    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx2.wait();

    console.log(`Transferred 1 ETH, ${numTokens} KAL, and ${numTokens} KAI to ${receiver}`);
  });

  task("balance", "Check account balance")
    .addPositionalParam("receiver", "The account to check balance of")
    .setAction(async ( {receiver} ) => {
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

      const kalomira = await ethers.getContractAt("Kalomira", address.Kalomira);
      const kardia = await ethers.getContractAt("KardiachainToken", address.Kardia);
      
      let balance = await kalomira.balanceOf(receiver);
      let balance2 = await kardia.balanceOf(receiver);
      balance = parseInt(balance._hex);
      balance2 = parseInt(balance2._hex);
      console.log(`The balance of ${receiver} is ${balance} KAL and ${balance2} KAI.`);
    });

  task("deposit", "Deposits specific token amount into contract")
    .addPositionalParam("amount", "Amount of tokens to be deposited")
    .addPositionalParam("account","The account that wants to deposit")    
    .setAction(async ( {amount, account} ) => {

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

      const kalomira = await ethers.getContractAt("Kalomira", address.Kalomira);
      const tx = await kalomira.deposit(amount);
      await tx.wait();

      let depositBal = await kalomira.depositAmount(account);
      console.log(`${account} has ${depositBal} KAL deposited.`)

    });