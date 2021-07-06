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
      expect(await vkaiToken.symbol()).to.equal("VKAI");
    });
  });

  describe("mint & redeem", function () {
    it("should mint equivalent VKAI based on exchange rate", async function () {
      const value = web3.utils.toWei("100", "ether");
      await vkaiToken.deposit({
        from: addr1,
        value,
      });
      const result = await vkaiToken.balanceOf(addr1);
      const actualValue = web3.utils.hexToNumberString(result);
      expect(actualValue).to.equal(value);
    });
  });
});
