const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = require("ethers")

describe("Token contract", function () {

  let ibkaiToken;
  let stakingContract;
  let owner, alice, bob, carol;

  beforeEach(async function () {
    [owner, alice, bob, carol] = await ethers.getSigners();

    // const Staking = await ethers.getContractFactory("ibKAI");
    // stakingContract = await Staking.deploy();
    // await stakingContract.deployed();

    const ibKAIToken = await ethers.getContractFactory("ibKAI");
    const deposit = ethers.utils.parseEther("10");
    const initialSupply = ethers.utils.parseEther("100");
    ibkaiToken = await ibKAIToken.deploy(deposit, initialSupply);
    await ibkaiToken.deployed();
  });

  describe("Deployment", function () {
    it("Should initialize okay", async function () {
      expect(ibkaiToken).to.be.ok
    });
  });

  describe("Mint and Redeem", function () {
    it("Should get correct mint and redeem rates", async function () {
      let amount = ethers.utils.parseEther("10");
      let mintRate = await ibkaiToken.connect(alice).getRateFromDeposit(amount);
      console.log("mint rate: ", (mintRate) / (10 ** 27))

      let redeemRate = await ibkaiToken.connect(alice).getRateFromWithdraw(amount);
      console.log("redeem rate: ", (redeemRate) / (10 ** 27))
    });

    it("Should receive native ETH/KAI correctly and mint correctly", async function () {
      console.log("Native balance before: ", (await ethers.provider.getBalance(alice.address)) / (10 ** 18))
      console.log("ibKAI balance before: ", (await ibkaiToken.balanceOf(alice.address)) / (10 ** 18))
      
      let amount = ethers.utils.parseEther("1");
      console.log("Mint amount: ", (await ibkaiToken.getMintAmount(amount)) / (10 ** 18))
      const tx = await ibkaiToken.connect(alice).deposit({
        value: amount,
      })

      console.log("Native balance after: ", (await ethers.provider.getBalance(alice.address)) / (10 ** 18))
      console.log("ibKAI balance after: ", (await ibkaiToken.balanceOf(alice.address)) / (10 ** 18))
    });

    it("Should redeem correct amount of native ETH/KAI", async function () {
      let depositAmt = ethers.utils.parseEther("1");
      const tx = await ibkaiToken.connect(alice).deposit({
        value: depositAmt,
      });

      console.log("Native balance before: ", (await ethers.provider.getBalance(alice.address)) / (10 ** 18))
      console.log("ibKAI balance before: ", (await ibkaiToken.balanceOf(alice.address)) / (10 ** 18))
      
      let redeemAmt = ethers.utils.parseEther("10");
      console.log("Redeem amount: ", (await ibkaiToken.getKAIRedeemAmount(redeemAmt)) / (10 ** 18))
      const tx2 = await ibkaiToken.connect(alice).withdraw(redeemAmt);
      
      console.log("Native balance after: ", (await ethers.provider.getBalance(alice.address)) / (10 ** 18))
      console.log("ibKAI balance after: ", (await ibkaiToken.balanceOf(alice.address)) / (10 ** 18))
    });
  });
});

// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("VKAI Token", () => {
//   let accounts;
//   let vkaiToken;
//   let kardiaStaking;
//   let owner;
//   let addr1;
//   let addr2;
//   let addr3;

//   let stakingContractAddress;
//   let validatorContractAddress;

//   beforeEach(async () => {
//     [owner, addr1, addr2, addr3] = await web3.eth.getAccounts();
//     kardiaStaking = await KardiaStakingMock.new();
//     vkaiToken = await VKAI.new(
//       web3.utils.toWei("100", "ether"), // _totalDeposit
//       web3.utils.toWei("100", "ether") // _initialSupply
//     );

//     console.log(`Kardia Staking Contract: ${kardiaStaking.address}`);
//     stakingContractAddress = kardiaStaking.address;
//     validatorContractAddress = "0x4952057973256F4f107eA854028Edfae2640b5Bd";

//     await vkaiToken.setStakingContract(
//       kardiaStaking.address,
//       kardiaStaking.address
//     );
//   });

//   describe("deployment", function () {
//     it("should set the right name and symbol", async function () {
//       console.log(await vkaiToken.name());
//       expect(await vkaiToken.name()).to.equal("Interest Bearing KAI Token");
//       expect(await vkaiToken.symbol()).to.equal("ibKAI");
//     });
//   });

//   describe("mint & redeem", function () {
//     it("should mint equivalent VKAI based on exchange rate", async function () {
//       const value1 = web3.utils.toWei("100", "ether");
//       const ibKAI1 = "83892525956137799514";

//       let kaiBalance = await web3.eth.getBalance(addr1);
//       let vkaiBalance = await vkaiToken.balanceOf(addr1);
//       console.log(
//         `KAI: ${web3.utils.fromWei(kaiBalance, "ether")}
//         ibKAI: ${web3.utils.fromWei(web3.utils.hexToNumberString(vkaiBalance))}`
//       );

//       // Test flow: Deposit => Validate => Add interest amount => Withdraw => Validate
//       await vkaiToken.deposit({
//         from: addr1,
//         value: value1,
//       });

//       // Check the balance again
//       kaiBalance = await web3.eth.getBalance(addr1);
//       vkaiBalance = await vkaiToken.balanceOf(addr1);
//       console.log(
//         `KAI: ${web3.utils.fromWei(kaiBalance, "ether")}
//         ibKAI: ${web3.utils.fromWei(web3.utils.hexToNumberString(vkaiBalance))}`
//       );
//       const actualValue = web3.utils.hexToNumberString(vkaiBalance);
//       expect(actualValue).to.equal(ibKAI1);

//       await kardiaStaking.addInterest(web3.utils.toWei("30", "ether"));

//       await vkaiToken.withdraw(web3.utils.toWei("20", "ether"), {
//         from: addr1,
//       });
//       kaiBalance = await web3.eth.getBalance(addr1);
//       const vkaiBalanceWithdraw = await vkaiToken.balanceOf(addr1);
//       console.log(
//         `KAI balance after:`,
//         web3.utils.fromWei(kaiBalance, "ether"),
//         web3.utils.fromWei(web3.utils.hexToNumberString(vkaiBalanceWithdraw))
//       );
//     });
//   });
// });