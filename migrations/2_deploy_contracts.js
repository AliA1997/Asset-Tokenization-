const ASCTToken = artifacts.require("./ASCTToken.sol");
const ASCTTokenSales = artifacts.require("./ASCTTokenSale.sol");
const KycContract = artifacts.require("./KycContract.sol")
require("dotenv").config({ path: "../.env" });

module.exports = async function (deployer) {
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(ASCTToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(KycContract);
  await deployer.deploy(ASCTTokenSales, 1, addr[0], ASCTToken.address, KycContract.address);
  let tokenInstance = await ASCTToken.deployed();
  await tokenInstance.transfer(
    ASCTTokenSales.address,
    process.env.INITIAL_TOKENS
  );
};
