import "@openzeppelin/test-helpers";

import * as TimeHelpers from "./utils/timetravel";

import {
  AddressProvider,
  FarmDistributor,
  FarmDistributor__factory,
  DistributorFactory,
  DistributorFactory__factory,
  MasterChef,
  MasterChef__factory,
  Kalos,
  Kalos__factory,
  WKAI,
  WKAI__factory,
} from "../typechain";
import chai, { expect } from "chai";
import { ethers, upgrades } from "hardhat";

import { Signer } from "ethers";
import { solidity } from "ethereum-waffle";
import { Provider } from "@ethersproject/abstract-provider";

chai.use(solidity);

describe("Farm Distributor", () => {
  // Accounts
  let deployer: Signer;
  let alice: Signer;
  let bob: Signer;
  let provider: Provider;

  let addressProvider: AddressProvider;

  let farmDistributor: FarmDistributor;
  let farmDistributorAsOwner: FarmDistributor;

  let distributor: DistributorFactory;

  let masterchef: MasterChef;

  let kalo: Kalos;

  let wkai: WKAI;

  beforeEach(async () => {
    const [_deployer, _alice, _bob] = await ethers.getSigners();
    provider = ethers.getDefaultProvider();

    deployer = _deployer;
    alice = _alice;
    bob = _bob;

    const AddressProvider = await ethers.getContractFactory("AddressProvider", { signer: deployer });
    addressProvider = (await upgrades.deployProxy(AddressProvider, [])) as unknown as AddressProvider;
    await addressProvider.deployed();

    const FarmDistributor = await ethers.getContractFactory("FarmDistributor", { signer: deployer });
    farmDistributor = (await upgrades.deployProxy(FarmDistributor, [
      addressProvider.address,
    ])) as unknown as FarmDistributor;
    await farmDistributor.deployed();

    const Distributor = await ethers.getContractFactory("DistributorFactory", { signer: deployer });
    distributor = (await upgrades.deployProxy(Distributor, [addressProvider.address])) as unknown as DistributorFactory;
    await distributor.deployed();

    const KALO = await ethers.getContractFactory("Kalos", { signer: deployer });
    kalo = await KALO.deploy();
    await kalo.deployed();

    const WKAI = await ethers.getContractFactory("WKAI", { signer: deployer });
    wkai = await WKAI.deploy();
    await wkai.deployed();

    const MasterChef = await ethers.getContractFactory("MasterChef", { signer: deployer });
    masterchef = await MasterChef.deploy(
      kalo.address,
      await deployer.getAddress(),
      ethers.utils.parseEther("100"),
      0,
      1000
    );
    await masterchef.deployed();

    await kalo.transferOwnership(masterchef.address);

    await masterchef.add(10, wkai.address, true);
    await farmDistributor._setRewardTokenAddress(kalo.address);
    await farmDistributor._setWKAIContract(wkai.address);
    await farmDistributor._setMasterchef(masterchef.address);
    await farmDistributor._setPoolID(0);
    farmDistributorAsOwner = FarmDistributor__factory.connect(farmDistributor.address, deployer);

    addressProvider.setAddress(ethers.utils.formatBytes32String("FARM_DISTRIBUTOR"), farmDistributor.address);
    addressProvider.setAddress(ethers.utils.formatBytes32String("DISTRIBUTOR"), distributor.address);
    addressProvider.setAddress(ethers.utils.formatBytes32String("KALOS_TOKEN"), kalo.address);
    addressProvider.setAddress(ethers.utils.formatBytes32String("WKAI_TOKEN"), wkai.address);
    addressProvider.setAddress(ethers.utils.formatBytes32String("MASTER_CHEF"), masterchef.address);
  });

  context("after deploying contracts", async () => {
    it("deploy correctly", async () => {
      expect(await farmDistributor.owner()).to.eq(await deployer.getAddress());
      expect(await kalo.owner()).to.eq(masterchef.address);
      expect(wkai).to.be.ok;
      expect(await wkai.totalSupply()).to.eq(0);
      expect(await masterchef.owner()).to.eq(await deployer.getAddress());
      expect(await masterchef.poolLength()).to.eq(1);
      expect(await masterchef.kaloPerBlock()).to.eq(ethers.utils.parseEther("100"));
      expect(await masterchef.kalo()).to.eq(kalo.address);

      expect(await addressProvider.getFarmDistributor()).to.eq(farmDistributor.address);
      expect(await addressProvider.getKalosToken()).to.eq(kalo.address);
      expect(await addressProvider.getWKAIToken()).to.eq(wkai.address);
      expect(await addressProvider.getMasterChef()).to.eq(masterchef.address);
    });
    it("should deposit and withdraw correctly", async () => {
      await deployer.sendTransaction({ to: distributor.address, value: ethers.utils.parseEther("1") });
      expect(await deployer.getBalance())
        .to.not.be.above(ethers.utils.parseEther("9999"))
        .and.not.be.below(ethers.utils.parseEther("9998"));
      expect(await distributor.provider.getBalance(distributor.address)).to.eq(ethers.utils.parseEther("1"));

      // deposit 1 KAI into farmDistributor
      await distributor.farmDeposit(ethers.utils.parseEther("1"));
      expect(await distributor.provider.getBalance(distributor.address)).to.eq(0);
      expect(await farmDistributor.provider.getBalance(farmDistributor.address)).to.eq(ethers.utils.parseEther("1"));

      // delegate that 1 KAI, wrap 1 KAI, send 1 WKAI to masterchef
      await distributor.farmDelegate(ethers.utils.parseEther("1"));
      expect(await farmDistributor.provider.getBalance(farmDistributor.address)).to.eq(0);
      expect(await wkai.provider.getBalance(wkai.address)).to.eq(ethers.utils.parseEther("1"));
      expect(await wkai.balanceOf(masterchef.address)).to.eq(ethers.utils.parseEther("1"));
      expect((await masterchef.userInfo(0, farmDistributor.address)).amount).to.eq(ethers.utils.parseEther("1"));

      // after 3 blocks, we should have 300 KALO as rewards
      await TimeHelpers.advanceBlock();
      await TimeHelpers.advanceBlock();
      await TimeHelpers.advanceBlock();
      expect(await masterchef.pendingKalo(0, farmDistributor.address)).to.eq(ethers.utils.parseEther("300"));

      // harvest current rewards, +100 KALO from mining this transaction => 400 KALO reward
      await distributor.farmHarvest();
      expect(await masterchef.pendingKalo(0, farmDistributor.address)).to.eq(0);
      expect(await kalo.balanceOf(farmDistributor.address)).to.eq(ethers.utils.parseEther("400"));

      // undelegate the 1 WKAI from masterchef, unwrap 1 KAI, +100 KALO from withdrawing from masterchef => 500 KALO reward
      await distributor.farmUndelegate(ethers.utils.parseEther("1"));
      expect((await masterchef.userInfo(0, farmDistributor.address)).amount).to.eq(0);
      expect(await wkai.balanceOf(masterchef.address)).to.eq(0);
      expect(await wkai.provider.getBalance(wkai.address)).to.eq(0);
      expect(await farmDistributor.provider.getBalance(farmDistributor.address)).to.eq(ethers.utils.parseEther("1"));

      // withdraw 1 KAI from farmDistributor
      await distributor.farmWithdraw(ethers.utils.parseEther("1"));
      expect(await farmDistributor.provider.getBalance(farmDistributor.address)).to.eq(0);
      expect(await distributor.provider.getBalance(distributor.address)).to.eq(ethers.utils.parseEther("1"));

      // transfer all rewards to owner
      await farmDistributorAsOwner._extractRewards();
      expect(await kalo.balanceOf(farmDistributor.address)).to.eq(0);
      // owner will have 500 KALO
      expect(await kalo.balanceOf(await deployer.getAddress())).to.eq(ethers.utils.parseEther("500"));
    });
  });
});
