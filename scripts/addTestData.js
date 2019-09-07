// NOTE: Can only be run on development!
const TestManaBank = artifacts.require("TestManaBank");
const TestKittyCore = artifacts.require("TestKittyCore");
const TestWizardCore = artifacts.require("TestWizardCore");

const kittyCount = 101;
const wizardCount = 302;

// Use ganache-cli -d 'foo' to generate test eth at this address
const mintAddress = '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'

const manaToMint = 100000;

const wizardIdsToMint = [
  1,
  2,
  3,
  4
]

const kittyIdsToMint = [
  5,
  6,
  7
]

module.exports = async function() {
  const mb = await TestManaBank.deployed();
  const kc = await TestKittyCore.deployed();
  const wc = await TestWizardCore.deployed();

  console.log("Setting kitty and wizard token counts");
  await mb.setTokenCount(kc.address, kittyCount);
  await mb.setTokenCount(wc.address, wizardCount);

  console.log(`Minting mana to ${mintAddress}`);
  await mb.mint(mintAddress, manaToMint);

  console.log("Minting kitties");
  for (const kittyId of kittyIdsToMint) {
    await kc.mint(mintAddress, kittyId);
  }

  console.log("Minting wizards");
  for (const wizardId of wizardIdsToMint) {
    await kc.mint(mintAddress, wizardId);
  }
}
