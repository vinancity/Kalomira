const { BigNumber } = require("ethers");

const BASE_TEN = 10;
function getBigNumber(amount, decimals = 18) {
	return BigNumber.from(amount).mul(BigNumber.from(BASE_TEN).pow(decimals));
}

async function main_v2() {
	if (network.name === "hardhat") {
		console.warn(
			"You are trying to deploy a contract to the Hardhat Network, which" +
				"gets automatically created and destroyed every time. Use the Hardhat" +
				" option '--network localhost'"
		);
	}
	const [deployer] = await ethers.getSigners();
	console.log(
		"Deploying the contracts with the account:",
		await deployer.getAddress()
	);

	console.log("Account balance:", (await deployer.getBalance()).toString());

	let deployments = [];

	const Kalomira = await ethers.getContractFactory("Kalomira");
	kaloToken = await Kalomira.deploy();
	await kaloToken.deployed();
	deployments.push({ name: "Kalomira", addr: kaloToken.address });
	console.log(deployments[0].name, deployments[0].addr);

	const ibKAI = await ethers.getContractFactory("ibKAI");
	const deposit = ethers.utils.parseEther("10");
	const initialSupply = ethers.utils.parseEther("100");
	let ibkaiToken = await ibKAI.deploy(deposit, initialSupply);
	await ibkaiToken.deployed();
	deployments.push({ name: "ibKAI", addr: ibkaiToken.address });
	console.log(deployments[1].name, deployments[1].addr);

	const LP1 = await ethers.getContractFactory("MockLP");
	lp1 = await LP1.deploy("ibKAI-KALO", "LP1", getBigNumber(100));
	await lp1.deployed();
	deployments.push({ name: "MockLP1", addr: lp1.address });
	console.log(deployments[2].name, deployments[2].addr);

	const LP2 = await ethers.getContractFactory("MockLP");
	lp2 = await LP2.deploy("ibKAI-DOGE", "LP2", getBigNumber(100));
	await lp2.deployed();
	deployments.push({ name: "MockLP2", addr: lp2.address });
	console.log(deployments[3].name, deployments[3].addr);

	const LP3 = await ethers.getContractFactory("MockLP");
	lp3 = await LP3.deploy("ibKAI-TEST", "LP3", getBigNumber(100));
	await lp3.deployed();
	deployments.push({ name: "MockLP3", addr: lp3.address });
	console.log(deployments[4].name, deployments[4].addr);

	// 100 KALO per block starting at block 100 with bonus until block 1000
	const MasterChef = await ethers.getContractFactory("MasterChef");
	let owner = await deployer.getAddress();
	masterchef = await MasterChef.deploy(kaloToken.address, owner, 100, 0, 1000);
	await masterchef.deployed();
	deployments.push({ name: "MasterChef", addr: masterchef.address });
	console.log(deployments[5].name, deployments[5].addr);

	await kaloToken._transferOwnership(masterchef.address);
	await masterchef.add(20, lp1.address, true);
	await masterchef.add(10, lp2.address, true);
	await masterchef.add(10, lp3.address, true);

	// We also save the contract's artifacts and address in the frontend directory
	saveFrontendFiles(deployments);
}

function saveFrontendFiles(deployments) {
	const fs = require("fs");
	const contractsDir = __dirname + "/../frontend/src/config/constants";

	if (!fs.existsSync(contractsDir)) {
		fs.mkdirSync(contractsDir);
	}

	let payload = ``;

	deployments.map((contract) => {
		payload += `${contract.name}: {
      31337: "${contract.addr}",
      0: "",
  },`;
	});

	fs.writeFileSync(
		contractsDir + "/contract.ts",
		`export default { ${payload} }`
	);
}

main_v2()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
