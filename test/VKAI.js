const { expect } = require("chai");
const { ethers } = require("hardhat");
const VKAI = artifacts.require("VKAI");

describe("VKAI Token", () => {
  let accounts;
  let vkaiToken;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3] = await web3.eth.getAccounts();
    vkaiToken = await VKAI.new();
  });

  describe("deployment", function () {
    it("should set the right name and symbol", async function () {
      expect(await vkaiToken.name()).to.equal("Virtual KAI");
      expect(await vkaiToken.symbol()).to.equal("vKAI");
    });
  });

  describe("mint & redeem", function () {
    it("should mint equivalent VKAI based on exchange rate", async function () {
      const value = web3.utils.toWei("100", "ether");
      let kaiBalance = await web3.eth.getBalance(addr1);
      const vkaiBalanceBefore = await vkaiToken.balanceOf(addr1);
      console.log(
        `KAI balance before:`,
        web3.utils.fromWei(kaiBalance, "ether"),
        web3.utils.hexToNumberString(vkaiBalanceBefore)
      );
      await vkaiToken.deposit({
        from: addr1,
        value,
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
      expect(actualValue).to.equal(value);

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
