const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require("fs");
const privateKey = fs
  .readFileSync(".secret")
  .toString()
  .trim();

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "50000" // Any network (default: none)
    },

    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    mainnet: {
      provider: () =>
        new HDWalletProvider(
          privateKey,
          "https://mainnet.infura.io/v3/ef471a67b23a4bd0a1bef19d00b8164d"
        ),
      network_id: 1, // kovan's id
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.10" // Fetch exact version from solc-bin (default: truffle's version)
    }
  },

  plugins: ["truffle-watch"]
};
