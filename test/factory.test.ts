import "@openzeppelin/test-helpers";

import * as TimeHelpers from "./utils/timetravel";

import {
  Factory,
  Factory__factory,
  FeeProvider,
  FeeProvider__factory,
  IBKAIToken,
  IBKAIToken__factory,
  AddressProvider,
  Treasury,
} from "../typechain";
import chai, { expect } from "chai";
import { ethers, upgrades } from "hardhat";

import { Signer } from "ethers";
import { solidity } from "ethereum-waffle";
import { Provider } from "@ethersproject/abstract-provider";

chai.use(solidity);

describe("Factory", () => {
  // Accounts
  let deployer: Signer;
  let alice: Signer;
  let bob: Signer;
  let provider: Provider;

  let addressProvider: AddressProvider;

  let factory: Factory;
  let factoryAsAlice: Factory;

  let feeProvider: FeeProvider;
  let treasury: Treasury;

  let ibkaiToken: IBKAIToken;
  let ibKaiAsAlice: IBKAIToken;

  beforeEach(async () => {
    const [_deployer, _alice, _bob] = await ethers.getSigners();
    provider = ethers.getDefaultProvider();

    deployer = _deployer;
    alice = _alice;
    bob = _bob;

    const AddressProvider = await ethers.getContractFactory("AddressProvider", { signer: deployer });
    addressProvider = (await upgrades.deployProxy(AddressProvider, [])) as unknown as AddressProvider;
    await addressProvider.deployed();

    const Factory = await ethers.getContractFactory("Factory", { signer: deployer });
    factory = (await upgrades.deployProxy(Factory, [addressProvider.address])) as unknown as Factory;
    await factory.deployed();

    const FeeProvider = await ethers.getContractFactory("FeeProvider", { signer: deployer });
    feeProvider = (await upgrades.deployProxy(FeeProvider, [addressProvider.address])) as unknown as FeeProvider;
    await feeProvider.deployed();

    const Treasury = await ethers.getContractFactory("Treasury", { signer: deployer });
    treasury = (await upgrades.deployProxy(Treasury, [addressProvider.address])) as unknown as Treasury;
    await treasury.deployed();

    const IBKAI = await ethers.getContractFactory("IBKAIToken", { signer: deployer });
    ibkaiToken = (await upgrades.deployProxy(IBKAI, [addressProvider.address])) as unknown as IBKAIToken;

    await ibkaiToken.transferOwnership(factory.address);
    factoryAsAlice = Factory__factory.connect(factory.address, alice);
    ibKaiAsAlice = IBKAIToken__factory.connect(ibkaiToken.address, alice);

    addressProvider.setAddress(ethers.utils.formatBytes32String("FACTORY"), factory.address);
    addressProvider.setAddress(ethers.utils.formatBytes32String("FEE_PROVIDER"), feeProvider.address);
    addressProvider.setAddress(ethers.utils.formatBytes32String("TREASURY"), treasury.address);
    addressProvider.setAddress(ethers.utils.formatBytes32String("IBKAI_TOKEN"), ibkaiToken.address);
  });

  context("after deploying contracts", async () => {
    it("deploy correctly", async function () {
      expect(await factory.owner()).to.eq(await deployer.getAddress());
      expect(await feeProvider.owner()).to.eq(await deployer.getAddress());
      expect(await treasury.owner()).to.eq(await deployer.getAddress());
      expect(await ibkaiToken.owner()).to.eq(factory.address);
      expect(await ibkaiToken.totalSupply()).to.eq(0);

      expect(await addressProvider.getFactory()).to.be.equal(factory.address);
      expect(await addressProvider.getFeeProvider()).to.be.equal(feeProvider.address);
      expect(await addressProvider.getTreasury()).to.be.equal(treasury.address);
      expect(await addressProvider.getIBKAIToken()).to.be.equal(ibkaiToken.address);

      console.log(ethers.utils.formatEther(await alice.getBalance())); //10000
    });

    it("should mint and redeem correctly", async () => {
      // alice must approve factory first (IBKAI)
      ibKaiAsAlice.approve(factory.address, ethers.constants.MaxUint256);
      // mint with 1 ETH, calc fees
      const afterMintFees = await feeProvider.calcFee(ethers.utils.parseEther("1"), true);
      const remainingAmt = afterMintFees[0];
      const feeAmt = afterMintFees[1];

      // fee 5% of the mint amount (0.05 * 1 ETH)
      expect(feeAmt).to.eq(ethers.utils.parseEther("0.05"));
      // remaining 95% of the mint amount (0.95 * 1 ETH)
      expect(remainingAmt).to.eq(ethers.utils.parseEther(".95"));

      await factoryAsAlice.mint({ value: ethers.utils.parseEther("1") });
      // after sending 1 ETH/KAI w/ fees
      expect(await alice.getBalance())
        .to.not.be.above(ethers.utils.parseEther("9999"))
        .and.not.be.below(ethers.utils.parseEther("9998"));

      // Alice should have 0.95 IBKAI after fees, and Treasury should have 0.05 IBKAI in fees
      expect(await ibkaiToken.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther(".95"));
      expect(await ibkaiToken.balanceOf(treasury.address)).to.eq(ethers.utils.parseEther(".05"));

      // ibkai contract should hold the underlying KAI
      expect(await ibkaiToken.provider.getBalance(ibkaiToken.address)).to.eq(ethers.utils.parseEther("1"));

      // redeem with 0.95 IBKAI, calc fees
      const afterRdmFees = await feeProvider.calcFee(ethers.utils.parseEther("0.95"), false);
      const remainingAmt_ = afterRdmFees[0];
      const feeAmt_ = afterRdmFees[1];

      // fee 4% of redeem amount (0.04 * 0.95) = 0.038 IBKAI
      expect(feeAmt_).to.eq(ethers.utils.parseEther(".038"));
      // remaining 96% of the redeem amount (0.96 * 0.95 IBKAI) = 0.912 IBKAI
      expect(remainingAmt_).to.eq(ethers.utils.parseEther(".912"));

      await factoryAsAlice.redeem(ethers.utils.parseEther("0.95"));

      // Alice should receive 0.912 ETH back
      expect(await alice.getBalance()).to.not.be.below(ethers.utils.parseEther("9999"));
      // Alice should have no IBKAI left
      expect(await ibkaiToken.balanceOf(await alice.getAddress())).to.eq(0);
      // Treasury should have +0.38 IBKAI in fees => 0.05 + 0.038 = 0.088 IBKAI
      expect(await ibkaiToken.balanceOf(treasury.address)).to.eq(ethers.utils.parseEther("0.088"));
    });

    it("should mint and redeem correctly after changing fee rates", async () => {
      // Change mint fee to 2.5% and redeem fee to 1.5%
      await feeProvider.setMintFee(250);
      await feeProvider.setRedeemFee(150);

      ibKaiAsAlice.approve(factory.address, ethers.constants.MaxUint256);
      // mint with 1 ETH, calc fees
      const afterMintFees = await feeProvider.calcFee(ethers.utils.parseEther("1"), true);
      const remainingAmt = afterMintFees[0];
      const feeAmt = afterMintFees[1];
      console.log((await factory.getOutputAmount(0)).toString());
      console.log((await ibkaiToken.getMintAmount(ethers.utils.parseEther("1"))).toString());
      console.log(remainingAmt.toString());

      // fee 2.5% of the mint amount (0.025 * 1 ETH)
      expect(feeAmt).to.eq(ethers.utils.parseEther("0.025"));
      // remaining 97.5% of the mint amount (0.975 * 1 ETH)
      expect(remainingAmt).to.eq(ethers.utils.parseEther("0.975"));

      await factoryAsAlice.mint({ value: ethers.utils.parseEther("1") });
      // after sending 1 ETH w/fees
      expect(await alice.getBalance())
        .to.not.be.above(ethers.utils.parseEther("9999"))
        .and.not.be.below(ethers.utils.parseEther("9998"));

      // Alice should have 0.975 IBKAI after fees, and Treasury should have 0.025 IBKAI in fees
      expect(await ibkaiToken.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther(".975"));
      expect(await ibkaiToken.balanceOf(treasury.address)).to.eq(ethers.utils.parseEther(".025"));

      // ibkai contract should hold the underlying KAI
      expect(await ibkaiToken.provider.getBalance(ibkaiToken.address)).to.eq(ethers.utils.parseEther("1"));

      // redeem with 0.975 IBKAI, calc fees
      const afterRdmFees = await feeProvider.calcFee(ethers.utils.parseEther("0.975"), false);
      const remainingAmt_ = afterRdmFees[0];
      const feeAmt_ = afterRdmFees[1];

      // fee 1.5% of redeem amount (0.015 * 0.975) = 0.014625 IBKAI
      expect(feeAmt_).to.eq(ethers.utils.parseEther(".014625"));
      // remaining 98.5% of the redeem amount (0.985 * 0.975 IBKAI) = 0.960375 IBKAI
      expect(remainingAmt_).to.eq(ethers.utils.parseEther(".960375"));

      await factoryAsAlice.redeem(ethers.utils.parseEther("0.975"));

      // Alice should receive 0.960375 ETH back
      expect(await alice.getBalance()).to.not.be.below(ethers.utils.parseEther("9999"));
      // Alice should have no IBKAI left
      expect(await ibkaiToken.balanceOf(await alice.getAddress())).to.eq(0);
      // Treasury should have +0.014625 IBKAI in fees => 0.014625 + 0.025 = 0.039625 IBKAI
      expect(await ibkaiToken.balanceOf(treasury.address)).to.eq(ethers.utils.parseEther("0.039625"));
    });
  });
});
