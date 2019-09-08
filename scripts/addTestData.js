// NOTE: Can only be run on development!
const TestManaBank = artifacts.require("TestManaBank");
const TestKittyCore = artifacts.require("TestKittyCore");
const TestWizardCore = artifacts.require("TestWizardCore");

// Use ganache-cli -d 'foo' to generate test eth at this address
const mintAddress = '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'


const kittiesToMint = 10;
const kittiesToDeposit = 1;

const wizardsToMint = 10;
const wizardsToDeposit = 2;

module.exports = async function() {
  const mb = await TestManaBank.deployed();
  const kc = await TestKittyCore.deployed();
  const wc = await TestWizardCore.deployed();

  // NOTE: Seems to be some path dependence problems here. Perhaps I need to mint in kitty *and* mint mana for
  // those kitties in one tx and do the rest of txes separately. Let's try that.
  console.log(`Depositing ${kittiesToDeposit} kitties for mana`);
  for (let i = 1; i <= kittiesToDeposit; i++) {
    await mb.mint(mintAddress, kc.address, i);
  }
  console.log(`Minting ${kittiesToMint} kitties`);
  for (let i = 2; i <= kittiesToMint; i++) {
    await kc.mint(mintAddress, i);
  }

  console.log(`Depositing ${wizardsToDeposit} wizards for mana`);
  for (let i = 1; i <= wizardsToDeposit; i++) {
    await mb.mint(mintAddress, wc.address, i);
  }
  console.log(`Minting ${wizardsToMint} wizards`);
  for (let i = 2; i <= wizardsToMint; i++) {
    await wc.mint(mintAddress, i);
  }
}
