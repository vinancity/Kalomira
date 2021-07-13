//const { ethers } = require("ethers");
const fs = require("fs");

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

    const kalToken = await ethers.getContractAt("Kalomira", address.Kalomira);
    const kaiToken = await ethers.getContractAt("KardiachainToken", address.Kardia);

    let balance = await kalToken.balanceOf(receiver);
    let balance2 = await kaiToken.balanceOf(receiver);
    balance = parseInt(balance._hex);
    balance2 = parseInt(balance2._hex);
    console.log(`The balance of ${receiver} is ${balance} KAL and ${balance2} KAI.`);
});

task("stake", "Stake KAI tokens")
.addPositionalParam("amount", "Amount to be staked")
.addPositionalParam("receiver", "Account to stake tokens")
.setAction(async ( { amount, receiver} ) => {
    const addressesFile =
    __dirname + "/../frontend/src/contracts/contract-address.json";

    if (!fs.existsSync(addressesFile)) {
    console.error("You need to deploy your contract first");
    return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);
    
    if ((await ethers.provider.getCode(address.TokenFarm)) === "0x") {
        console.error("You need to deploy your contract first");
        return;
    }

    [alice, bob] = await ethers.getSigners();

    const kalToken = await ethers.getContractAt("Kalomira", address.Kalomira);
    const kaiToken = await ethers.getContractAt("KardiachainToken", address.Kardia);
    const kalFarm = await ethers.getContractAt("TokenFarm", address.TokenFarm);

    let toTransfer = ethers.utils.parseEther(amount);
    console.log(await kalFarm.isStaking(receiver))
    //await kaiToken.connect(receiver).approve(farm.address, toTransfer);
    //await kalFarm.connect(receiver).stake(toTransfer);

    //console.log(amount, receiver)
});