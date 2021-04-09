const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  contracts_directory: "./contracts",
  networks: {
    development: {
      port: 7545,
      host: "127.0.0.1",
      network_id: "*", // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          process.env.SEED_PHRASE,
          `https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`
        );
      },
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "^0.7.0",
    },
  },
};
