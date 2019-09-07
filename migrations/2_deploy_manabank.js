const ManaBank = artifacts.require("ManaBank");

const TestManaBank = artifacts.require("TestManaBank");
const TestWizardCore = artifacts.require("TestWizardCore");
const TestKittyCore = artifacts.require("TestKittyCore");

module.exports = function (deployer, network) {
  if (network === 'development') {
    deployer.deploy(TestManaBank);
    deployer.deploy(TestWizardCore);
    deployer.deploy(TestKittyCore);
  }

  deployer.deploy(ManaBank);
};
