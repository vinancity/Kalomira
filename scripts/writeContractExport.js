const { BigNumber } = require("ethers");
const { artifacts } = require("hardhat");

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
	kaloToken = await Kalomira.deploy();
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
	lp3 = await LP3.deploy("ibKAI-TEST", "LP3", getBigNumber(100));
	await lp3.deployed();
	deployments.push({ name: "MockLP3", addr: lp3.address });
	console.log(deployments[x].name, deployments[x].addr);
	x++;

	// 100 KALO per block starting at block 100 with bonus until block 1000
	const Masterchef = await ethers.getContractFactory("MasterChef");
	let owner = await deployer.getAddress();
	masterchef = await Masterchef.deploy(kaloToken.address, owner, 100, 0, 1000);
	await masterchef.deployed();
	deployments.push({ name: "MasterChef", addr: masterchef.address });
	console.log(deployments[x].name, deployments[x].addr);
	x++;

	await kaloToken._transferOwnership(masterchef.address);
	await masterchef.add(20, lp1.address, true);
	await masterchef.add(10, lp2.address, true);
	await masterchef.add(10, lp3.address, true);

	// We also save the contract's artifacts and address in the frontend directory
	saveAddresses(deployments);
	saveAbi(deployments);
	saveBytecode(deployments);
}

function saveAddresses(deployments) {
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

function saveAbi(deployments) {
	const fs = require("fs");
	const contractsDir = __dirname + "/../frontend/src/config/abi";

	deployments.map((contract) => {
		let artifact;
		if (
			contract.name == "MockLP1" ||
			contract.name == "MockLP2" ||
			contract.name == "MockLP3"
		) {
			artifact = artifacts.readArtifactSync("MockLP");
		} else {
			artifact = artifacts.readArtifactSync(contract.name);
		}

		fs.writeFileSync(
			contractsDir + `/${contract.name}.json`,
			JSON.stringify(artifact.abi, null, 2)
		);
	});
}

function saveBytecode(deployments) {
	const fs = require("fs");
	const contractsDir = __dirname + "/../frontend/src/config/bytecode";

	deployments.map((contract) => {
		let artifact;
		if (
			contract.name == "MockLP1" ||
			contract.name == "MockLP2" ||
			contract.name == "MockLP3"
		) {
			artifact = artifacts.readArtifactSync("MockLP");
		} else {
			artifact = artifacts.readArtifactSync(contract.name);
		}

		fs.writeFileSync(
			contractsDir + `/${contract.name}.json`,
			JSON.stringify(artifact.bytecode, null, 2)
		);
	});
}

main_v2()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
