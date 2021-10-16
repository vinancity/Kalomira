import '@openzeppelin/test-helpers';

import { network } from 'hardhat';

async function main() {
  const result = await network.provider.send('hardhat_setBalance', [
    '0x50e9c5C38f9966cb7a56bbF18431B5674AF91eFe',
    '0x3635C9ADC5DEA00000',
  ]);
  console.log(`Faucet success!`, JSON.stringify(result, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
