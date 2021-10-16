import '@openzeppelin/test-helpers';

import * as TimeHelpers from './utils/timetravel';

import {
  Treasury,
  Treasury__factory,
  KLS,
  KLS__factory,
  Kalos,
  Kalos__factory,
  AddressProvider,
  MockLP,
} from '../typechain';
import chai, { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';

import { Signer } from 'ethers';
import { solidity } from 'ethereum-waffle';

chai.use(solidity);

describe('Treasury', () => {
  // Accounts
  let deployer: Signer;
  let alice: Signer;
  let bob: Signer;

  let addressProvider: AddressProvider;

  let treasury: Treasury;
  let treasuryAsOwner: Treasury;
  let treasuryAsAlice: Treasury;
  let treasuryAsBob: Treasury;

  let kls: KLS;
  let usdt: MockLP;

  let kalo: Kalos;
  let kaloAsAlice: Kalos;
  let kaloAsBob: Kalos;

  let rewardToken: Kalos;

  beforeEach(async () => {
    const [_deployer, _alice, _bob] = await ethers.getSigners();

    deployer = _deployer;
    alice = _alice;
    bob = _bob;

    const AddressProvider = await ethers.getContractFactory('AddressProvider', { signer: deployer });
    addressProvider = (await upgrades.deployProxy(AddressProvider, [])) as unknown as AddressProvider;
    await addressProvider.deployed();

    const Treasury = await ethers.getContractFactory('Treasury', { signer: deployer });
    treasury = (await upgrades.deployProxy(Treasury, [addressProvider.address])) as unknown as Treasury;
    await treasury.deployed();

    const KLS = await ethers.getContractFactory('KLS', { signer: deployer });
    kls = await KLS.deploy();
    await kls.deployed();

    const USDT = await ethers.getContractFactory('MockLP', { signer: deployer });
    usdt = await USDT.deploy('USD Token', 'USDT', ethers.utils.parseEther('10000000000'));
    await usdt.deployed();

    const KALO = await ethers.getContractFactory('Kalos', { signer: deployer });
    kalo = await KALO.deploy();
    await kalo.deployed();

    const REWARD = await ethers.getContractFactory('Kalos', { signer: deployer });
    rewardToken = await REWARD.deploy();
    await rewardToken.deployed();

    await treasury.setKLSRewardToken(usdt.address);
    await usdt.transfer(treasury.address, ethers.utils.parseEther('10000000000'));

    addressProvider.setAddress(ethers.utils.formatBytes32String('KLS_TOKEN'), kls.address);
    addressProvider.setAddress(ethers.utils.formatBytes32String('KALOS_TOKEN'), kalo.address);
    addressProvider.setAddress(ethers.utils.formatBytes32String('TREASURY'), treasury.address);
  });

  context('after deploying contracts', async () => {
    const five = ethers.utils.parseEther('5');
    const ten = ethers.utils.parseEther('10');
    const fifteen = ethers.utils.parseEther('15');
    beforeEach(async () => {
      kls.snapshot();
    });
    it('deploy correctly', async function () {
      expect(await kls.name()).to.be.equal('Kalos Trading Volume Token');
      expect(await kls.symbol()).to.be.equal('KLS');
      expect(await kls.currentSnapshot()).to.be.equal(1);
      expect(await kls.balanceOf_(await alice.getAddress())).to.eq(0);
      expect(await kls.totalSupply_()).to.eq(0);

      expect(await usdt.totalSupply()).to.eq(ethers.utils.parseEther('10000000000'));
      expect(await usdt.balanceOf(treasury.address)).to.eq(ethers.utils.parseEther('10000000000'));

      expect(await kalo.name()).to.be.eq('Kalos');

      expect(await addressProvider.getKLSToken()).to.be.equal(kls.address);
      expect(await addressProvider.getKalosToken()).to.be.equal(kalo.address);
      expect(await addressProvider.getTreasury()).to.be.equal(treasury.address);
    });
    it('should mint and track weekly balances correctly', async () => {
      await kls.mint(await alice.getAddress(), ten);
      expect(await kls.totalSupply_()).to.eq(ten);
      expect(await kls.balanceOf_(await alice.getAddress())).to.eq(ten);
      // new week 2
      await kls.snapshot();
      expect(await kls.totalSupply_()).to.eq(0);
      expect(await kls.balanceOf_(await alice.getAddress())).to.eq(0);
      // new week 3
      await kls.snapshot();
      await kls.mint(await alice.getAddress(), five);
      expect(await kls.totalSupply_()).to.eq(five);
      expect(await kls.balanceOf_(await alice.getAddress())).to.eq(five);
      expect(await kls.totalSupply()).to.eq(fifteen);
      expect(await kls.balanceOf(await alice.getAddress())).to.eq(fifteen);
      // new week 4
      await kls.snapshot();
      await kls.mint(await alice.getAddress(), ten);
      await kls.mint(await deployer.getAddress(), fifteen);
      expect(await kls.totalSupply_()).to.eq(ethers.utils.parseEther('25'));
      expect(await kls.balanceOf_(await alice.getAddress())).to.eq(ten);
      expect(await kls.totalSupply()).to.eq(ethers.utils.parseEther('40'));
      expect(await kls.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther('25'));
    });
    it('should prevent transfers', async () => {
      await kls.mint(await alice.getAddress(), ten);
      const klsAsAlice = KLS__factory.connect(kls.address, alice);
      expect(await klsAsAlice.transfer(await deployer.getAddress(), ten)).to.eq(false);
      expect(await kls.balanceOf_(await deployer.getAddress())).to.eq(0);
      expect(await kls.transferFrom(await alice.getAddress(), await deployer.getAddress(), ten)).to.eq(false);
      expect(await kls.balanceOf_(await deployer.getAddress())).to.eq(0);
      expect(await kls.balanceOf(await alice.getAddress())).to.eq(ten);
    });
  });

  context('treasury KLS testing', async () => {
    const ten = ethers.utils.parseEther('10');
    const twenty = ethers.utils.parseEther('20');
    const fifty = ethers.utils.parseEther('50');
    const hundred = ethers.utils.parseEther('100');
    beforeEach(async () => {
      treasuryAsAlice = Treasury__factory.connect(treasury.address, alice);
      treasuryAsOwner = Treasury__factory.connect(treasury.address, deployer);
      kls.transferOwnership(treasury.address);
      treasuryAsOwner.resetWeek(0); // week 0, no rewards
    });

    it('user weekly rewards should be correct', async () => {
      let week;
      const aliceAddr = await alice.getAddress();
      const ownerAddr = await deployer.getAddress();
      // week 1
      await treasuryAsOwner.resetWeek(hundred); // set 100 USDT as week 1 reward
      week = await treasury.currentWeek(); // snapshot = 2
      expect(week).to.eq(1); // we are now in week 1
      expect(await treasury.USDTrewardAt(week)).to.eq(hundred); // the reward at week 1 is 100 USDT
      await treasuryAsOwner.mintKLS(ownerAddr, ten);
      await treasuryAsOwner.mintKLS(aliceAddr, ten);
      expect(await kls.balanceOf_(await alice.getAddress())).to.eq(ten); // Alice has 10 KLS during this week
      expect(await kls.totalSupply_()).to.eq(twenty); // 20 KLS minted this week

      // week 2
      await treasuryAsOwner.resetWeek(ethers.utils.parseEther('500')); // set 500 USDT as week 2 reward
      week = await treasury.currentWeek(); // snapshot = 3
      expect(week).to.eq(2); // we are now in week 2
      expect(await treasuryAsAlice.userRewardAt(week)).to.eq(ethers.utils.parseEther('50')); // alice reward at week 2 (previous week's rewards) = 50 USDT

      expect(await treasury.USDTrewardAt(week)).to.eq(ethers.utils.parseEther('500')); // the reward at week 2 is 500 USDT
      await treasuryAsOwner.mintKLS(ownerAddr, ethers.utils.parseEther('10'));
      await treasuryAsOwner.mintKLS(aliceAddr, ethers.utils.parseEther('30'));
      expect(await kls.balanceOf_(aliceAddr)).to.eq(ethers.utils.parseEther('30')); // Alice has 30 KLS during this week
      expect(await kls.totalSupply_()).to.eq(ethers.utils.parseEther('40')); // 40 KLS minted this week

      // week 3
      await treasuryAsOwner.resetWeek(ethers.utils.parseEther('250')); // set 250 as week 3 reward
      week = await treasury.currentWeek(); // snapshot = 4
      expect(week).to.eq(3); // we are now in week 3
      expect(await treasuryAsAlice.userRewardAt(week)).to.eq(ethers.utils.parseEther('375'));

      expect(await treasury.USDTrewardAt(week)).to.eq(ethers.utils.parseEther('250')); // reward for this week is 250 USDT
      await treasuryAsOwner.mintKLS(ownerAddr, ethers.utils.parseEther('25'));
      await treasuryAsOwner.mintKLS(aliceAddr, ethers.utils.parseEther('15'));
      expect(await kls.balanceOf_(aliceAddr)).to.eq(ethers.utils.parseEther('15')); // Alice as 15 KLS this week
      expect(await kls.totalSupply_()).to.eq(ethers.utils.parseEther('40')); // 40 KLS minted this week

      // week 4
      await treasuryAsOwner.resetWeek(0);
      week = await treasury.currentWeek(); // snapshot = 5
      expect(week).to.eq(4);
      expect(await treasuryAsAlice.userRewardAt(week)).to.eq(ethers.utils.parseEther('93.75'));

      let totalRewards = ethers.utils.parseEther('0');
      for (let x = week.toNumber(); x > 1; x--) {
        totalRewards = totalRewards.add(await treasuryAsAlice.userRewardAt(x));
      }
      // week 1,2,3 rewards = 50 + 375 + 93.75
      expect(totalRewards).to.eq(ethers.utils.parseEther('518.75')); // not inlcuding week 4 or 0(in progress): 518.75

      // simulate JS frontend looping to claim all rewards
      for (let x = 2; x <= week.toNumber(); x++) {
        await treasuryAsAlice.claimKLSRewards(x);
      }
      expect(await usdt.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther('518.75'));
    });
  });

  context('treasury KALOS testing', async () => {
    beforeEach(async () => {
      treasuryAsAlice = Treasury__factory.connect(treasury.address, alice);
      kaloAsAlice = Kalos__factory.connect(kalo.address, alice);
      treasuryAsBob = Treasury__factory.connect(treasury.address, bob);
      kaloAsBob = Kalos__factory.connect(kalo.address, bob);
    });

    it('reward correctly', async () => {
      await kalo.connect(deployer).mint(await alice.getAddress(), ethers.utils.parseEther('25000'));
      await kalo.connect(deployer).mint(await bob.getAddress(), ethers.utils.parseEther('25000'));
      await rewardToken.connect(deployer).mint(treasury.address, ethers.utils.parseEther('50000'));

      await kalo.name();
      await rewardToken.name();
      expect(await kalo.totalSupply()).to.eq(ethers.utils.parseEther('50000'));
      expect(await rewardToken.totalSupply()).to.eq(ethers.utils.parseEther('50000'));
      expect(await rewardToken.balanceOf(treasury.address)).to.eq(ethers.utils.parseEther('50000'));

      expect(await kalo.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther('25000'));
      expect(await kalo.balanceOf(await bob.getAddress())).to.eq(ethers.utils.parseEther('25000'));

      const rewardPerBlock = ethers.utils.parseEther('100');
      const latestBlock = await TimeHelpers.latestBlockNumber();
      treasury.addSmartChef(kalo.address, rewardToken.address, rewardPerBlock, latestBlock, latestBlock.add(1000), 0);
      expect(await rewardToken.balanceOf(treasury.address)).to.eq(0); // should transfer reward balance to chef for rewarding
      expect(await treasury.poolLength()).to.eq(1);

      await kaloAsAlice.approve(treasury.address, ethers.constants.MaxUint256);
      await treasuryAsAlice.stake(0, ethers.utils.parseEther('5000'));

      await kaloAsBob.approve(treasury.address, ethers.constants.MaxUint256);
      await treasuryAsBob.stake(0, ethers.utils.parseEther('5000'));

      expect(await kalo.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther('20000'));
      expect(await kalo.balanceOf(await bob.getAddress())).to.eq(ethers.utils.parseEther('20000'));

      // Alice stakes, then 2 blocks are mined when Bob approves/stakes
      // Alice reward = 2 blocks * 100 Reward/block = 200
      // Bob reward = 0 blocks * 100 Reward/block 0
      expect(await treasuryAsAlice.pendingReward(0)).to.eq(ethers.utils.parseEther('200'));
      expect(await treasuryAsBob.pendingReward(0)).to.eq(0);
      // console.log(ethers.utils.formatEther(await treasuryAsAlice.pendingReward(0)));
      // console.log(ethers.utils.formatEther(await treasuryAsBob.pendingReward(0)));

      // mine 5 blocks
      await TimeHelpers.advanceBlockTo((await TimeHelpers.latestBlockNumber()).add(5).toNumber());

      // Alice reward = 5 blocks * (100 Reward/block)/2 stakers = 250 + (200 accumulated) = 450 total
      // Bob reward = 5 blocks * (100 Reward/block)/2 stakers = 250 total
      expect(await treasuryAsAlice.pendingReward(0)).to.eq(ethers.utils.parseEther('450'));
      expect(await treasuryAsBob.pendingReward(0)).to.eq(ethers.utils.parseEther('250'));

      // Alice unstakes all her tokens + 50 rewarded after mined
      await treasuryAsAlice.unstake(0, ethers.utils.parseEther('5000'));
      expect(await kalo.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther('25000'));
      expect(await rewardToken.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther('500'));

      // 1 block mined when alice unstakes
      // Bob reward = 1 block * 100 Reward/block = 100 + (250 accumulated) = 350 total
      // Bob unstakes some tokens => 50 rewarded when mined
      await treasuryAsBob.unstake(0, ethers.utils.parseEther('3000'));
      expect(await kalo.balanceOf(await bob.getAddress())).to.eq(ethers.utils.parseEther('23000'));
      expect(await rewardToken.balanceOf(await bob.getAddress())).to.eq(ethers.utils.parseEther('400'));
    });
  });
});
