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
	let x = 0;

	const Multicall = await ethers.getContractFactory("Multicall");
	let multicall = await Multicall.deploy();
	await multicall.deployed();
	deployments.push({ name: "Multicall", addr: multicall.address });
	console.log(deployments[x].name, deployments[x].addr);
	x++;

	const Kalomira = await ethers.getContractFactory("Kalomira");
	let kaloToken = await Kalomira.deploy();
	await kaloToken.deployed();
	deployments.push({ name: "Kalomira", addr: kaloToken.address });
	console.log(deployments[x].name, deployments[x].addr);
	x++;

	const ibKAI = await ethers.getContractFactory("ibKAI");
	const deposit = ethers.utils.parseEther("10");
	const initialSupply = ethers.utils.parseEther("100");
	let ibkaiToken = await ibKAI.deploy(deposit, initialSupply);
	await ibkaiToken.deployed();
	deployments.push({ name: "ibKAI", addr: ibkaiToken.address });
	console.log(deployments[x].name, deployments[x].addr);
	x++;

	const LP1 = await ethers.getContractFactory("MockLP");
	lp1 = await LP1.deploy("ibKAI-KALO", "LP1", getBigNumber(100));
	await lp1.deployed();
	deployments.push({ name: "MockLP1", addr: lp1.address });
	console.log(deployments[x].name, deployments[x].addr);
	x++;

	const LP2 = await ethers.getContractFactory("MockLP");
	lp2 = await LP2.deploy("ibKAI-DOGE", "LP2", getBigNumber(100));
	await lp2.deployed();
	deployments.push({ name: "MockLP2", addr: lp2.address });
	console.log(deployments[x].name, deployments[x].addr);
	x++;

	const LP3 = await ethers.getContractFactory("MockLP");
	let lp3 = await LP3.deploy("ibKAI-TEST", "LP3", getBigNumber(100));
	await lp3.deployed();
	deployments.push({ name: "MockLP3", addr: lp3.address });
	console.log(deployments[x].name, deployments[x].addr);
	x++;

	// 100 KALO per block starting at block 100 with bonus until block 1000
	const MasterChef = await ethers.getContractFactory("MasterChef");
	let owner = await deployer.getAddress();
	masterchef = await MasterChef.deploy(kaloToken.address, owner, 100, 0, 1000);
	await masterchef.deployed();
	deployments.push({ name: "MasterChef", addr: masterchef.address });
	console.log(deployments[x].name, deployments[x].addr);
	x++;

	await kaloToken._transferOwnership(masterchef.address);
	await masterchef.add(20, lp1.address, true);
	await masterchef.add(10, lp2.address, true);
	await masterchef.add(10, lp3.address, true);

	// We also save the contract's artifacts and address in the frontend directory
	saveFrontendFiles(deployments);
}

function saveFrontendFiles(deployments) {
	const fs = require("fs");
	const contractsDir = __dirname + "/../frontend/src/config/";

	if (!fs.existsSync(contractsDir)) {
		fs.mkdirSync(contractsDir);
		fs.mkdirSync(contractsDir + "/constants");
		fs.mkdirSync(contractsDir + "/abi");
		fs.mkdirSync(contractsDir + "/bytecode");
	}

	fs.writeFileSync(
		contractsDir + "/constants/contracts.json",
		JSON.stringify(
			{
				[deployments[0].name]: deployments[0].addr,
				[deployments[1].name]: deployments[1].addr,
				[deployments[2].name]: deployments[2].addr,
				[deployments[3].name]: deployments[3].addr,
				[deployments[4].name]: deployments[4].addr,
				[deployments[5].name]: deployments[5].addr,
				[deployments[6].name]: deployments[6].addr,
			},
			undefined,
			2
		)
	);

	const KalomiraArtifact = artifacts.readArtifactSync("Kalomira");
	/* Deploy Kalomira abi and bytecode */
	fs.writeFileSync(
		contractsDir + "/abi/Kalomira.json",
		JSON.stringify(KalomiraArtifact.abi, null, 2)
	);
	fs.writeFileSync(
		contractsDir + "/bytecode/Kalomira.json",
		JSON.stringify(KalomiraArtifact.bytecode, null, 2)
	);

	/* Deploy Kalomira abi and bytecode */
	const ibKAIArtifact = artifacts.readArtifactSync("ibKAI");
	fs.writeFileSync(
		contractsDir + "/abi/ibKAI.json",
		JSON.stringify(ibKAIArtifact.abi, null, 2)
	);
	fs.writeFileSync(
		contractsDir + "/bytecode/ibKAI.json",
		JSON.stringify(ibKAIArtifact.bytecode, null, 2)
	);

	/* Deploy Kalomira abi and bytecode */
	const MockLPArtifact = artifacts.readArtifactSync("MockLP");
	fs.writeFileSync(
		contractsDir + "/abi/MockLP.json",
		JSON.stringify(MockLPArtifact.abi, null, 2)
	);

	fs.writeFileSync(
		contractsDir + "/bytecode/MockLP.json",
		JSON.stringify(MockLPArtifact.bytecode, null, 2)
	);

	/* Deploy Kalomira abi and bytecode */
	const MasterChefArtifact = artifacts.readArtifactSync("MasterChef");
	fs.writeFileSync(
		contractsDir + "/abi/MasterChef.json",
		JSON.stringify(MasterChefArtifact.abi, null, 2)
	);
	fs.writeFileSync(
		contractsDir + "/bytecode/MasterChef.json",
		JSON.stringify(MasterChefArtifact.bytecode, null, 2)
	);
}

main_v2()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
