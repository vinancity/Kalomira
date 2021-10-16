import '@openzeppelin/test-helpers';

import * as TimeHelpers from './utils/timetravel';

import { IBKAIToken, IBKAIToken__factory } from '../typechain';
import chai, { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';

import { Signer } from 'ethers';
import { solidity } from 'ethereum-waffle';

chai.use(solidity);

describe('InterestBearingToken', () => {
  // Accounts
  let deployer: Signer;
  let alice: Signer;
  let bob: Signer;

  let ibKAI: IBKAIToken;
  let ibKAIAsAlice: IBKAIToken;

  beforeEach(async () => {
    const [_deployer, _alice, _bob, _eve] = await ethers.getSigners();

    deployer = _deployer;
    alice = _alice;
    bob = _bob;

    const IbKAIToken = await ethers.getContractFactory('IBKAIToken', { signer: deployer });
    ibKAI = (await upgrades.deployProxy(IbKAIToken, [])) as unknown as IBKAIToken;
    await ibKAI.deployed();
    await ibKAI.transferOwnership(await alice.getAddress());

    ibKAIAsAlice = IBKAIToken__factory.connect(ibKAI.address, alice);
  });

  context('when deploy contract', async () => {
    it('should check name and symbol', async function () {
      expect(await ibKAI.name()).to.be.equal('Interest Bearing KAI');
      expect(await ibKAI.symbol()).to.be.equal('ibKAI');
    });

    it('should mint few IBKAI by owner only', async () => {
      //   const amount = ethers.utils.parseEther('100');
      //   console.log(
      //     `owner: ${await ibKAI.owner()} - deployer: ${await deployer.getAddress()} - alice: ${await alice.getAddress()}`
      //   );
      //   expect(await alice.getBalance()).to.be.equal(ethers.utils.parseEther('10000'));
      //   await ibKAIAsAlice.mint(await bob.getAddress(), amount, { value: amount });
      //   const bobIBKAI = await ibKAI.balanceOf(await bob.getAddress());
      //   console.log(`Balance: ${bobIBKAI}`);
    });
  });
});
