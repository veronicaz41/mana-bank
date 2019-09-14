import ManaBank from "../build/contracts/ManaBank.json";
import KittyCore from "../build/contracts/KittyCore.json";
import WizardPresale from "../build/contracts/WizardPresale.json";

import TestManaBank from "../build/contracts/TestManaBank.json";
import TestKittyCore from "../build/contracts/TestKittyCore.json";
import TestWizardCore from "../build/contracts/TestWizardCore.json";

import Web3 from "web3";

let contracts = [];
if (process.env.NODE_ENV === "development") {
  const devNetwork = 50000; // As set by `npm run ganache`

  const web3Instance = new Web3(Web3.givenProvider);
  contracts = [
    {
      contractName: "ManaBank",
      web3Contract: new web3Instance.eth.Contract(
        TestManaBank.abi,
        TestManaBank.networks[devNetwork].address
      )
    },
    {
      contractName: "KittyCore",
      web3Contract: new web3Instance.eth.Contract(
        TestKittyCore.abi,
        TestKittyCore.networks[devNetwork].address
      )
    },
    {
      // TODO: Determine what the actual contract name is here based on the real version
      contractName: "WizardPresale",
      web3Contract: new web3Instance.eth.Contract(
        TestWizardCore.abi,
        TestWizardCore.networks[devNetwork].address
      )
    }
  ];
} else {
  contracts = [ManaBank, KittyCore, WizardPresale];
}

const options = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545"
    }
  },

  // The contracts to monitor
  contracts: contracts,
  events: {
    WizardPresale: ["ApprovalForAll"],
    KittyCore: ["ApprovalForAll"],
    ManaBank: ["GetMana"]
  },
  polls: {
    // check accounts ever 15 seconds
    accounts: 15000
  }
};

export default options;
