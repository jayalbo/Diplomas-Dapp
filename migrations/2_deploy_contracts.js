var Diplomas = artifacts.require("./Diplomas.sol");

module.exports = function (deployer) {
  deployer.deploy(Diplomas);
};
