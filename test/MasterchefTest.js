const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = require("ethers")

async function advanceBlock() {
  return ethers.provider.send("evm_mine", [])
}

async function advanceBlockTo(blockNumber) {
  for (let i = await ethers.provider.getBlockNumber(); i < blockNumber; i++) {
    await advanceBlock()
  }
}

function getBigNumber(amount) {
    return utils.parseEther(amount.toString())
}

describe("Testing", function(){
    let kaloToken;
    let lp1, lp2;
    let masterchef;
    let owner, alice, bob, carol;

    beforeEach(async function(){
        [owner, alice, bob, carol] = await ethers.getSigners();

        const Kalomira = await ethers.getContractFactory("Kalomira");
        kaloToken = await Kalomira.deploy();
        await kaloToken.deployed();

        const LP1 = await ethers.getContractFactory("MockLP");
        lp1 = await LP1.deploy("LPToken 1", "LP1", getBigNumber(25));
        await lp1.deployed();

        const LP2 = await ethers.getContractFactory("MockLP");
        lp2 = await LP2.deploy("LPToken 2", "LP2", getBigNumber(25));
        await lp2.deployed();

        // 100 KALO per block starting at block 100 with bonus until block 1000
        const MasterChef = await ethers.getContractFactory("MasterChef");
        masterchef = await MasterChef.deploy(kaloToken.address, owner.address, getBigNumber(100), 100, 1000);
        await masterchef.deployed();

        await kaloToken._transferOwnership(masterchef.address);

        await Promise.all([
            lp1.connect(owner).transfer(alice.address, getBigNumber(5)),
            lp2.connect(owner).transfer(alice.address, getBigNumber(5)),

            lp1.connect(owner).transfer(bob.address, getBigNumber(5)),
            lp2.connect(owner).transfer(bob.address, getBigNumber(5)),

            lp1.connect(owner).transfer(carol.address, getBigNumber(5)),
            lp2.connect(owner).transfer(carol.address, getBigNumber(5)),
        ])
    });

    // describe("Init", function() {
    //     it("Should initialize without issue", async() => {
    //         expect(kaloToken).to.be.ok;
    //         expect(masterchef).to.be.ok;
    //         expect(lp1).to.be.ok;
    //         expect(lp2).to.be.ok;
    //     });
        

    //     it("Should have correct owners", async() => {
    //         expect(await kaloToken.owner()).to.eq(masterchef.address);
    //     });

    //     it("Should have transfered correctly", async() => {
    //         expect(await lp1.balanceOf(alice.address)).to.eq(2000);
    //         expect(await lp1.balanceOf(bob.address)).to.eq(2000);
    //         expect(await lp1.balanceOf(carol.address)).to.eq(2000);
    //     });
    // });

    describe("LP pool", function() {
        
        // it("Should allow emergency withdrawal", async() => {
        //     await masterchef.add(500, lp1.address, true);
        //     await lp1.connect(alice).approve(masterchef.address, 1000);
        //     await masterchef.connect(alice).deposit(0, 500);

        //     expect(await lp1.balanceOf(alice.address)).to.eq(1500);
        //     await masterchef.connect(alice).emergencyWithdraw(0);
        //     expect(await lp1.balanceOf(alice.address)).to.eq(2000);

        // });    
        
        // it("Should reward KALO only after farming time ", async() => {
        //     await masterchef.add(100, lp1.address, true);
        //     await lp1.connect(alice).approve(masterchef.address, 1000);
            
        //     await masterchef.connect(alice).deposit(0, 100);
        //     expect((await kaloToken.balanceOf(alice.address))).to.eq(0)
        //     await advanceBlockTo(89);

        //     await masterchef.connect(alice).deposit(0, 0);
        //     expect((await kaloToken.balanceOf(alice.address))).to.eq(0)
        //     await advanceBlockTo(94);

        //     await masterchef.connect(alice).deposit(0, 0);
        //     expect((await kaloToken.balanceOf(alice.address))).to.eq(0)
        //     await advanceBlockTo(99);

        //     await masterchef.connect(alice).deposit(0, 0);
        //     expect((await kaloToken.balanceOf(alice.address))).to.eq(0)
        //     await advanceBlockTo(100);

        //     await masterchef.connect(alice).deposit(0, 0);
        //     expect((await kaloToken.balanceOf(alice.address))).to.eq(1000)
        //     await advanceBlockTo(104);

        //     await masterchef.connect(alice).deposit(0, 0);
            
        //     expect(await kaloToken.balanceOf(alice.address)).to.eq(5000)
        //     expect(await kaloToken.balanceOf(owner.address)).to.eq(500)
        //     expect(await kaloToken.totalSupply()).to.eq(5500)
        // }); 

        it("Should not reward KALO if no one deposits", async() => {
            await masterchef.add(100, lp1.address, true);
            await lp1.connect(alice).approve(masterchef.address, getBigNumber(5));

            await advanceBlockTo(99);
            expect(await kaloToken.totalSupply()).to.eq(0);

            await advanceBlockTo(104);
            expect(await kaloToken.totalSupply()).to.eq(0);

            await advanceBlockTo(109);
            await masterchef.connect(alice).deposit(0, getBigNumber(0.21));
            expect(await kaloToken.totalSupply()).to.eq(0);
            expect(await kaloToken.balanceOf(alice.address)).to.eq(0);
            expect(await kaloToken.balanceOf(owner.address)).to.eq(0);
            expect(await lp1.balanceOf(alice.address)).to.eq(getBigNumber(4.79));

            await advanceBlockTo(119);
            await masterchef.connect(alice).withdraw(0, getBigNumber(0.21));

            expect(await kaloToken.totalSupply()).to.eq(getBigNumber(11000));
            //expect(await kaloToken.balanceOf(alice.address)).to.eq(getBigNumber(10000));
            expect(await kaloToken.balanceOf(owner.address)).to.eq(getBigNumber(1000));
            expect(await lp1.balanceOf(alice.address)).to.eq(getBigNumber(5));
        });

        // it("Should distribute KALO properly for each staker", async() =>{
        //     await masterchef.add(100, lp1.address, true);
        //     await lp1.connect(alice).approve(masterchef.address, 1000);
        //     await lp1.connect(bob).approve(masterchef.address, 1000);
        //     await lp1.connect(carol).approve(masterchef.address, 1000);

        //     // Alice deposit 10 LP at block 110
        //     await advanceBlockTo(109);
        //     await masterchef.connect(alice).deposit(0, 10);

        //     // Bob deposit 20 LP at block 114
        //     await advanceBlockTo(113);
        //     await masterchef.connect(bob).deposit(0, 20);

        //     // Carol deposit 30 LP at block 118
        //     await advanceBlockTo(117);
        //     await masterchef.connect(carol).deposit(0, 30);

        //     // Alice deposits 10 more LPs at block 120. At this point:
        //     //   Alice should have: 4*1000 + 4*1/3*1000 + 2*1/6*1000 = 5666
        //     //   MasterChef should have the remaining: 10000 - 5666 = 4334
        //     await advanceBlockTo(119)
        //     await masterchef.connect(alice).deposit(0, 10);
        //     expect(await kaloToken.totalSupply()).to.eq(11000);
        //     expect(await kaloToken.balanceOf(alice.address)).to.eq(5666);
        //     expect(await kaloToken.balanceOf(bob.address)).to.eq(0)
        //     expect(await kaloToken.balanceOf(carol.address)).to.eq(0)
        //     expect(await kaloToken.balanceOf(masterchef.address)).to.eq(4334)
        //     expect(await kaloToken.balanceOf(owner.address)).to.eq(1000)

        //     // Bob withdraws 5 LPs at block 130. At this point:
        //     //   Bob should have: 4*2/3*1000 + 2*2/6*1000 + 10*2/7*1000 = 6190
        //     await advanceBlockTo(129);
        //     await masterchef.connect(bob).withdraw(0, 5);
        //     expect(await kaloToken.totalSupply()).to.eq(22000);
        //     expect(await kaloToken.balanceOf(alice.address)).to.eq(5666);
        //     expect(await kaloToken.balanceOf(bob.address)).to.eq(6190);
        //     expect(await kaloToken.balanceOf(carol.address)).to.eq(0);
        //     expect(await kaloToken.balanceOf(masterchef.address)).to.eq(8144)
        //     expect(await kaloToken.balanceOf(owner.address)).to.eq(2000)

        //     // Alice withdraws 20 LPs at block 140.
        //     // Bob withdraws 15 LPs at block 150.
        //     // Carol withdraws 30 LPs at block 160.

        //     await advanceBlockTo(139);
        //     await masterchef.connect(alice).withdraw(0, 20);
        //     await advanceBlockTo(149);
        //     await masterchef.connect(bob).withdraw(0, 15);
        //     await advanceBlockTo(159);
        //     await masterchef.connect(carol).withdraw(0, 30);
        //     expect(await kaloToken.totalSupply()).to.eq(55000);
        //     expect(await kaloToken.balanceOf(owner.address)).to.eq(5000)
        //     // Alice should have: 5666 + 10*2/7*1000 + 10*2/6.5*1000 = 11600
        //     expect(await kaloToken.balanceOf(alice.address)).to.equal("11600")
        //     // Bob should have: 6190 + 10*1.5/6.5 * 1000 + 10*1.5/4.5*1000 = 11831
        //     expect(await kaloToken.balanceOf(bob.address)).to.equal("11831")
        //     // Carol should have: 2*3/6*1000 + 10*3/7*1000 + 10*3/6.5*1000 + 10*3/4.5*1000 + 10*1000 = 26568
        //     expect(await kaloToken.balanceOf(carol.address)).to.equal("26568")
        //     // All of them should have 2000 LPs back.
        //     expect(await lp1.balanceOf(alice.address)).to.equal("2000")
        //     expect(await lp1.balanceOf(bob.address)).to.equal("2000")
        //     expect(await lp1.balanceOf(carol.address)).to.equal("2000")
        // });

        // it("Should give correct KALO allocation to each pool", async() => {
        //     await lp1.connect(alice).approve(masterchef.address, 1000)
        //     await lp2.connect(bob).approve(masterchef.address, 1000)
        //     // Add first LP to the pool with allocation 1
        //     await masterchef.add(10, lp1.address, true)

        //     // Alice deposits 10 LPs at block 110
        //     await advanceBlockTo(109)
        //     await masterchef.connect(alice).deposit(0, 10)

        //     // Add LP2 to the pool with allocation 2 at block 120
        //     await advanceBlockTo(119)
        //     await masterchef.add(20, lp2.address, true)

        //     // Alice should have 10*1000 pending reward
        //     expect(await masterchef.pendingKalo(0, alice.address)).to.equal(10000)

        //     // Bob deposits 5 LP2s at block 425
        //     await advanceBlockTo(124)
        //     await masterchef.connect(bob).deposit(1, 5)

        //     // Alice should have 10000 + 5*1/3*1000 = 11666 pending reward
        //     expect(await masterchef.pendingKalo(0, alice.address)).to.equal(11666)
        //     await advanceBlockTo(130)

        //     // At block 130. Bob should get 5*2/3*1000 = 3333. Alice should get ~1666 more.
        //     expect(await masterchef.pendingKalo(0, alice.address)).to.equal(13333)
        //     expect(await masterchef.pendingKalo(1, bob.address)).to.equal(3333)
        // });
    });
});