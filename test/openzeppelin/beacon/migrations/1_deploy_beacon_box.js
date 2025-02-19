const { deployBeacon, deployBeaconProxy } = require('@openzeppelin/truffle-upgrades');
const Box = artifacts.require('BeaconBox');

module.exports = async function (deployer) {
  try {
    // Setup tronbox deployer
    deployer.trufflePlugin = true;
    const beacon = await deployBeacon(Box, { deployer });
    console.info('Beacon deployed', beacon.address);
    const instance = await deployBeaconProxy(beacon, Box, [42], { deployer });
    console.info('Deployed', instance.address);

    // Call proxy contract
    const box = await Box.deployed();
    const beforeValue = await box.value();
    console.info('Value before', beforeValue);

    // Set new Value
    await box.setValue(beforeValue + 100n);
    const afterValue = await box.value();
    console.info('Value after', afterValue);
  } catch (error) {
    console.error('Beacon: deploy box error', error);
  }
};
