task("mine", "mines next block")
  .setAction(async () => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }
    const [sender] = await ethers.getSigners();
    for(let i = 0; i < 5; i++){
      const tx = await sender.sendTransaction({
        to: sender.address,
        value: 0,
      });
      await tx.wait();   
    }
    
  });