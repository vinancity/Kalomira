import '@openzeppelin/test-helpers';

import * as TimeHelpers from './utils/timetravel';

import { MasterChef, MasterChef__factory, Kalos, Kalos__factory, MockLP, MockLP__factory } from '../typechain';
import chai, { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';

import { Signer } from 'ethers';
import { solidity } from 'ethereum-waffle';
import { Provider } from '@ethersproject/abstract-provider';

chai.use(solidity);

describe('Farm Distributor', () => {
  // Accounts
  let deployer: Signer;
  let alice: Signer;
  let bob: Signer;
  let provider: Provider;

  let masterchef: MasterChef;

  let kalo: Kalos;
  let lp: MockLP;

  beforeEach(async () => {
    const [_deployer, _alice, _bob] = await ethers.getSigners();
    provider = ethers.getDefaultProvider();

    deployer = _deployer;
    alice = _alice;
    bob = _bob;

    const KALO = await ethers.getContractFactory('Kalos', { signer: deployer });
    kalo = await KALO.deploy();
    await kalo.deployed();

    const LP = await ethers.getContractFactory('MockLP', { signer: deployer });
    lp = await LP.deploy('LP1', 'ibKAI-TEST', ethers.utils.parseEther('1000000000'));
    await lp.deployed();

    const MasterChef = await ethers.getContractFactory('MasterChef', { signer: deployer });
    masterchef = await MasterChef.deploy(
      kalo.address,
      await deployer.getAddress(),
      ethers.utils.parseEther('100'),
      0,
      1000
    );
    await masterchef.deployed();
    await kalo.mint(masterchef.address, ethers.utils.parseEther('1000000000')); // 1 Billion KALO mint on deploy to masterchef
    await kalo.transferOwnership(masterchef.address);
    await masterchef.add(100, lp.address, true);
  });

  context('after deploying contracts', async () => {
    it('deploy correctly', async () => {
      expect(await kalo.owner()).to.eq(masterchef.address);
      expect(await kalo.totalSupply()).to.eq(ethers.utils.parseEther('1000000000'));
      expect(await kalo.balanceOf(masterchef.address)).to.eq(ethers.utils.parseEther('1000000000'));
      expect(await masterchef.owner()).to.eq(await deployer.getAddress());
      expect(await masterchef.poolLength()).to.eq(1);
      expect(await masterchef.kaloPerBlock()).to.eq(ethers.utils.parseEther('100'));
      expect(await masterchef.kalo()).to.eq(kalo.address);
    });
    it('should reward correctly', async () => {
      await lp.transfer(await alice.getAddress(), ethers.utils.parseEther('100'));
      await lp.transfer(await bob.getAddress(), ethers.utils.parseEther('100'));

      expect(await lp.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther('100'));
      expect(await lp.balanceOf(await bob.getAddress())).to.eq(ethers.utils.parseEther('100'));

      await lp.connect(alice).approve(masterchef.address, ethers.constants.MaxUint256);
      await lp.connect(bob).approve(masterchef.address, ethers.constants.MaxUint256);

      await masterchef.connect(alice).deposit(0, ethers.utils.parseEther('50'));
      await TimeHelpers.advanceBlock();
      await TimeHelpers.advanceBlock();
      // after 2 block, alice rewards = 200 KALO
      expect(await masterchef.pendingKalo(0, await alice.getAddress())).to.eq(ethers.utils.parseEther('200'));

      // after this deposit, alice rewards +100 KALO
      await masterchef.connect(bob).deposit(0, ethers.utils.parseEther('50'));
      expect(await masterchef.pendingKalo(0, await alice.getAddress())).to.eq(ethers.utils.parseEther('300'));
      await TimeHelpers.advanceBlock();
      await TimeHelpers.advanceBlock();
      await TimeHelpers.advanceBlock();
      await TimeHelpers.advanceBlock();

      // after 4 blocks:
      // alice => (0.5*100)*4 = 200 KALO + (300 before)
      // bob => (0.5*100)*4 = 200 KALO
      expect(await masterchef.pendingKalo(0, await alice.getAddress())).to.eq(ethers.utils.parseEther('500'));
      expect(await masterchef.pendingKalo(0, await bob.getAddress())).to.eq(ethers.utils.parseEther('200'));

      // alice withdraws all LP, rewarded 500 KALO + 50 from this block
      // bob gets +50 from this block
      await masterchef.connect(alice).withdraw(0, ethers.utils.parseEther('50'));
      await TimeHelpers.advanceBlock();
      await TimeHelpers.advanceBlock();
      // after 2 blocks, bob +250 KALO
      // bob withdraws all LP, rewarded 400 KALO + 100 from this block
      await masterchef.connect(bob).withdraw(0, ethers.utils.parseEther('50'));
      expect(await kalo.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther('550'));
      expect(await kalo.balanceOf(await bob.getAddress())).to.eq(ethers.utils.parseEther('550'));
      // masterchef should have transferred out rewards correctly (550+550 = 1100)
      expect(await kalo.balanceOf(masterchef.address)).to.eq(
        ethers.utils.parseEther('1000000000').sub(ethers.utils.parseEther('1100'))
      );
    });
    it('Should allow emergency withdrawal with no rewards', async () => {
      await lp.transfer(await alice.getAddress(), ethers.utils.parseEther('100'));
      await lp.connect(alice).approve(masterchef.address, ethers.constants.MaxUint256);
      await masterchef.connect(alice).deposit(0, ethers.utils.parseEther('50'));
      expect(await lp.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther('50'));

      await TimeHelpers.advanceBlock();
      await TimeHelpers.advanceBlock();
      expect(await masterchef.pendingKalo(0, await alice.getAddress())).to.eq(ethers.utils.parseEther('200'));

      await masterchef.connect(alice).emergencyWithdraw(0);
      expect(await lp.balanceOf(await alice.getAddress())).to.eq(ethers.utils.parseEther('100'));
      expect(await masterchef.pendingKalo(0, await alice.getAddress())).to.eq(0);
      expect(await kalo.balanceOf(await alice.getAddress())).to.eq(0);
    });
  });
});
