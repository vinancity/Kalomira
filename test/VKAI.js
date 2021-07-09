const { expect } = require("chai");
const { ethers } = require("hardhat");
const VKAI = artifacts.require("VKAI");
const KardiaStakingMock = artifacts.require("KardiaStakingMock");

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
    vkaiToken = await VKAI.new();
    console.log(`Kardia Staking Contract: ${kardiaStaking.address}`);
    stakingContractAddress = kardiaStaking.address;
    validatorContractAddress = "0x4952057973256F4f107eA854028Edfae2640b5Bd";

    await vkaiToken.setStakingContract(
      kardiaStaking.address,
      validatorContractAddress
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
      const value2 = web3.utils.toWei("50", "ether");
      let kaiBalance = await web3.eth.getBalance(addr1);
      const vkaiBalanceBefore = await vkaiToken.balanceOf(addr1);
      console.log(
        `KAI balance before:`,
        web3.utils.fromWei(kaiBalance, "ether"),
        web3.utils.hexToNumberString(vkaiBalanceBefore)
      );
      await vkaiToken.deposit({
        from: addr1,
        value: value1,
      });
      await vkaiToken.deposit({
        from: addr2,
        value: value2,
      });
      kaiBalance = await web3.eth.getBalance(addr1);
      const vkaiBalanceAfter = await vkaiToken.balanceOf(addr1);
      console.log(
        `KAI balance after:`,
        web3.utils.fromWei(kaiBalance, "ether"),
        web3.utils.fromWei(web3.utils.hexToNumberString(vkaiBalanceAfter))
      );
      const result = await vkaiToken.balanceOf(addr1);
      const actualValue = web3.utils.hexToNumberString(result);
      expect(actualValue).to.equal(value1);

      await vkaiToken.withdraw(web3.utils.toWei("50", "ether"), {
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
