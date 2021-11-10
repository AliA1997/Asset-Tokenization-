const path = require("path");
require("dotenv").config({ path: "./.env" });
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MetaMaskAccountIndex = 1;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    ganache_local: {
      provider: function () {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "HTTP://127.0.0.1:7545",
          MetaMaskAccountIndex
        );
      },
      network_id: 5777,
    },
    ropsten_infura: {
      provider: function () {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://ropsten.infura.io/v3/a5917a0efc7e40a185f517c60f8092b8",
          MetaMaskAccountIndex
        );
      },
      network_id: 3,
    },
    goerli_infura: {
      provider: function () {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://goerli.infura.io/v3/a5917a0efc7e40a185f517c60f8092b8",
          MetaMaskAccountIndex
        );
      },
      network_id: 5,
    },
  },
  compilers: {
    solc: {
      version: "^0.6.0",
    },
  },
};
