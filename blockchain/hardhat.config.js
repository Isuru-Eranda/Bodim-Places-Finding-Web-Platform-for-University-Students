require("@nomiclabs/hardhat-ethers");
require("hardhat/config");

module.exports = {
  solidity: "0.8.19",
  paths: {
    sources: "contracts",
    tests: "test",
    cache: "cache",
    artifacts: "artifacts",
  },
};
