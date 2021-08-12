const { expect } = require("chai");
const { ethers } = require("hardhat");
const VKAI = artifacts.require("VKAI");
const KardiaStakingMock = artifacts.require("KardiaStakingMock");
const EpochBlock = artifacts.require("EpochBlock");

describe("VKAI Token", () => {
  let accounts;
  let vkaiToken;
  let kardiaStaking;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  let stakingContractAddress;
  let validatorContractAddress;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3] = await web3.eth.getAccounts();
    kardiaStaking = await KardiaStakingMock.new();
    vkaiToken = await VKAI.new(
      web3.utils.toWei("100", "ether"), // _totalDeposit
      web3.utils.toWei("100", "ether") // _initialSupply
    );

    // try {
    //   await web3.eth.sendTransaction({
    //     from: addr3,
    //     to: vkaiToken.address,
    //     value: web3.utils.toWei("100", "ether"),
    //   });
    // } catch (err) {
    //   console.error(err);
    // }

    console.log(`Kardia Staking Contract: ${kardiaStaking.address}`);
    stakingContractAddress = kardiaStaking.address;
    validatorContractAddress = "0x4952057973256F4f107eA854028Edfae2640b5Bd";

    await vkaiToken.setStakingContract(
      kardiaStaking.address,
      kardiaStaking.address
    );
  });

  describe("deployment", function () {
    it("should set the right name and symbol", async function () {
      console.log(await vkaiToken.name());
      expect(await vkaiToken.name()).to.equal("Interest Bearing KAI Token");
      expect(await vkaiToken.symbol()).to.equal("ibKAI");
    });
  });

  describe("mint & redeem", function () {
    it("should mint equivalent VKAI based on exchange rate", async function () {
      const value1 = web3.utils.toWei("100", "ether");
      const ibKAI1 = "83892525956137799514";

      let kaiBalance = await web3.eth.getBalance(addr1);
      let vkaiBalance = await vkaiToken.balanceOf(addr1);
      console.log(
        `KAI: ${web3.utils.fromWei(kaiBalance, "ether")}
        ibKAI: ${web3.utils.fromWei(web3.utils.hexToNumberString(vkaiBalance))}`
      );

      // Test flow: Deposit => Validate => Add interest amount => Withdraw => Validate
      await vkaiToken.deposit({
        from: addr1,
        value: value1,
      });

      // Check the balance again
      kaiBalance = await web3.eth.getBalance(addr1);
      vkaiBalance = await vkaiToken.balanceOf(addr1);
      console.log(
        `KAI: ${web3.utils.fromWei(kaiBalance, "ether")}
        ibKAI: ${web3.utils.fromWei(web3.utils.hexToNumberString(vkaiBalance))}`
      );
      const actualValue = web3.utils.hexToNumberString(vkaiBalance);
      expect(actualValue).to.equal(ibKAI1);

      await kardiaStaking.addInterest(web3.utils.toWei("30", "ether"));

      await vkaiToken.withdraw(web3.utils.toWei("20", "ether"), {
        from: addr1,
      });
      kaiBalance = await web3.eth.getBalance(addr1);
      const vkaiBalanceWithdraw = await vkaiToken.balanceOf(addr1);
      console.log(
        `KAI balance after:`,
        web3.utils.fromWei(kaiBalance, "ether"),
        web3.utils.fromWei(web3.utils.hexToNumberString(vkaiBalanceWithdraw))
      );
    });
  });
});
