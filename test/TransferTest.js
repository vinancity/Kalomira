const { expect } = require("chai");

describe("Token contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  let Token;
  let kalToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("Kalomira");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    kalToken = await Token.deploy();
    await kalToken.deployed();

    await kalToken.mint(owner.address, 50000);

  });

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
      const addr1Balance = await kalToken.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await kalToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await kalToken.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await kalToken.balanceOf(
        owner.address
      );

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        kalToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await kalToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await kalToken.balanceOf(
        owner.address
      );

      // Transfer 100 tokens from owner to addr1.
      await kalToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await kalToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await kalToken.balanceOf(
        owner.address
      );
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await kalToken.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await kalToken.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });
  });
});
