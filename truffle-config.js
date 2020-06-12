const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: '39.105.81.9',
      port: 8545,
      network_id: '*' // Match any network id
    },
  ganacheNet: {  // 配置ganache网络环境
    host: "39.105.81.9",
    port: 8545,
    network_id: "5777" // match any network
  },
  develop: {
      port: 8545
    }
},

 
  mocha: {
    // timeout: 100000
  },
  compilers: {
    solc: {
    }
  }
};
