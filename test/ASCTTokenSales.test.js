const ASCTToken = artifacts.require("ASCTToken");
const ASCTTokenSales = artifacts.require("ASCTTokenSale");
const KycContract = artifacts.require("KycContract");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale", async function (accounts) {
  const [initialHolder, recipient, anotherAccount] = accounts;

  it("there shouldnt be any coins in my account", async () => {
    let instance = await ASCTToken.deployed();
    const initialHolderFunds = await instance.balanceOf.call(initialHolder);
    return expect(initialHolderFunds).to.be.a.bignumber.equal(new BN(0));
  });

  //other code in test

  it("should be possible to buy one token by simply sending ether to the smart contract", async () => {
    let tokenInstance = await ASCTToken.deployed();
    let tokenSaleInstance = await ASCTTokenSales.deployed();
    let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);

    await expect(tokenSaleInstance.sendTransaction({ from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.rejected;
    await expect(balanceBeforeAccount).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient));
    let kycInstance = await KycContract.deployed();
    await kycInstance.setKycCompleted(recipient);

    await tokenSaleInstance.sendTransaction({
      from: recipient,
      value: web3.utils.toWei("1", "wei"),
    });
    balanceBeforeAccount.add(new BN(1));
    
    return expect(balanceBeforeAccount).to.be.bignumber.equal(
      await tokenInstance.balanceOf.call(recipient)
    );
  });
});
