const { expect } = require("chai");
const { BigNumber } = require("ethers")
const { network } = require("hardhat");
const { now } = require("jquery");

describe("Testing", function () {

  let kalToken;
  let kaiToken;
  let kalFarm;
  let owner;
  let alice;
  let bob;

  const kaiAmount = ethers.BigNumber.from(ethers.utils.parseEther("25000"));

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.    
    [owner, alice, bob] = await ethers.getSigners();

    const Kalomira = await ethers.getContractFactory("Kalomira");
    kalToken = await Kalomira.deploy();
    await kalToken.deployed();

    const Kardia = await ethers.getContractFactory("Kalomira");
    kaiToken = await Kardia.deploy();
    await kaiToken.deployed();

    const TokenFarm = await ethers.getContractFactory("TokenFarm");
    kalFarm = await TokenFarm.deploy(kaiToken.address, kalToken.address);
    await kalFarm.deployed();

    await Promise.all([      
      kaiToken.mint(owner.address, kaiAmount),
      kaiToken.mint(alice.address, kaiAmount),
      kaiToken.mint(bob.address, kaiAmount)      
    ]);

    //console.log(parseInt((await kaiToken.balanceOf(owner.address))._hex))
  });

  describe("Init", function() {
    it("Should initialize wihtout issue", async() => {
        expect(kalToken).to.be.ok;
        expect(kaiToken).to.be.ok;
        expect(kalFarm).to.be.ok;
    });
  });

  describe("Stake", function() {
    it("should accept KAI and update mapping", async() => {
      let toTransfer = ethers.utils.parseEther("100");
      await kaiToken.connect(alice).approve(kalFarm.address, toTransfer);

      expect(await kalFarm.isStaking(alice.address)).to.eq(false);
      expect(await kalFarm.connect(alice).stake(toTransfer)).to.be.ok;
      expect(await kalFarm.stakingBalance(alice.address)).to.eq(toTransfer);
      expect(await kalFarm.isStaking(alice.address)).to.eq(true);
    });

    it("should update balance with multiple stakes", async() => {
      let toTransfer = ethers.utils.parseEther("100");
      await kaiToken.connect(alice).approve(kalFarm.address, toTransfer);
      await kalFarm.connect(alice).stake(toTransfer);

      await kaiToken.connect(alice).approve(kalFarm.address, toTransfer);
      await kalFarm.connect(alice).stake(toTransfer);

      expect(await kalFarm.stakingBalance(alice.address)).to.eq(ethers.utils.parseEther("200"));
    });

    it("should revert with not enough funds", async() => {
      let toTransfer = ethers.utils.parseEther("1000000");
      await kaiToken.approve(kalFarm.address, toTransfer);

      await expect(kalFarm.connect(bob).stake(toTransfer)).to.be.revertedWith("You cannot stake zero tokens");
    });
  });

  describe("Unstake", function() {
    this.beforeEach(async() => {
      let toTransfer = ethers.utils.parseEther("100");
      await kaiToken.connect(alice).approve(kalFarm.address, toTransfer);
      await kalFarm.connect(alice).stake(toTransfer);
    });

    it("should unstake balance from user", async() => {
      let toTransfer = ethers.utils.parseEther("100");
      await kalFarm.connect(alice).unstake(toTransfer);

      let result = await kalFarm.stakingBalance(alice.address);
      expect(result).to.eq(0);

      expect(await kalFarm.isStaking(alice.address)).to.eq(false);
    });
  });

  describe("Withdraw", function() {
    this.beforeEach(async() => {
      await kalToken._transferOwnership(kalFarm.address);
      let toTransfer = ethers.utils.parseEther("10");
      await kaiToken.connect(alice).approve(kalFarm.address, toTransfer);
      await kalFarm.connect(alice).stake(toTransfer);
    });

    it("owner should be transferred correctly", async() => {
      expect(await kalToken.owner()).to.eq(kalFarm.address)
    });

    it("should return correct yield time", async() => {
      let timeStart = await kalFarm.startTime(alice.address);
      expect(Number(timeStart)).to.be.greaterThan(0);

      await network.provider.send("evm_increaseTime", [86400]); // increase time by 24 hours
      await network.provider.send("evm_mine"); // mine the next block to increase block timestamp

      expect(await kalFarm.calculateYieldTime(alice.address)).to.eq(86400);

    });

    it("should mint correct token amount in total supply and user", async() => {
      await network.provider.send("evm_increaseTime", [86400]); // increase time by 24 hours
      await network.provider.send("evm_mine"); // mine the next block to increase block timestamp

      let _time = await kalFarm.calculateYieldTime(alice.address);
      let formatTime = _time/86400;
      let staked = await kalFarm.stakingBalance(alice.address);
      let bal = staked * formatTime;
      let newBal = ethers.utils.formatEther(bal.toString());
      let expected = Number.parseFloat(newBal).toFixed(3);

      await kalFarm.connect(alice).withdrawYield();

      let result = await kalToken.totalSupply();
      let newResult = ethers.utils.formatEther(result);
      let formatResult = Number.parseFloat(newResult).toFixed(3).toString();

      expect(expected).to.eq(formatResult);

      result = await kalToken.balanceOf(alice.address);
      newResult = ethers.utils.formatEther(result);
      formatResult = Number.parseFloat(newResult).toFixed(3).toString();

      expect(expected).to.eq(formatResult);
      
    });

    it("should update yield balance when unstaked", async() => {
      await network.provider.send("evm_increaseTime", [86400]); // increase time by 24 hours
      await network.provider.send("evm_mine"); // mine the next block to increase block timestamp

      await kalFarm.connect(alice).unstake(ethers.utils.parseEther("5"));

      let result = await kalFarm.kalBalance(alice.address);
      expect(Number(ethers.utils.formatEther(result))).to.be.approximately(10, 0.001);
      
    });
  });
/*
  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await kalToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await kalToken.balanceOf(owner.address);
      expect(await kalToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await kalToken.transfer(addr1.address, 50);
      const addr1Balance = await kalToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await kalToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await kalToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await kalToken.balanceOf(owner.address);

      // Owner balance shouldn't have changed.
      expect(await kalToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await kalToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await kalToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await kalToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await kalToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await kalToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await kalToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });*/
});
