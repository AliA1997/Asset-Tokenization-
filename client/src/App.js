import React, { Component } from "react";
import ASCTToken from "./contracts/ASCTToken.json";
import ASCTTokenSales from "./contracts/ASCTTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "0x123", tokenSaleAddress: "0x123", userTokens: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      
      this.asctToken = new this.web3.eth.Contract(
        ASCTToken.abi,
        ASCTToken.networks[this.networkId] && ASCTToken.networks[this.networkId].address
      );

      this.asctTokenSales = new this.web3.eth.Contract(
        ASCTTokenSales.abi,
        ASCTTokenSales.networks[this.networkId] && ASCTTokenSales.networks[this.networkId].address
      );
      
      this.kycContract = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address
      );
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState({ loaded: true, tokenSaleAddress: this.asctTokenSales._address }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  //Update the user tokens, that will get the balance of the owner account to indicate how many tokens were bought.
  updateUserTokens = async () => {
    let userTokens = await this.asctToken.methods.balanceOf(this.accounts[0]).call();
    this.setState({ userTokens });
  }
  //Add a event listener to listen for transfer event.
  listenToTokenTransfer = async () => {
    this.asctToken.events.Transfer({ to: this.accounts[0] }).on("data", this.updateUserTokens);
  }

  onChangeHandler = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({ [name]: value });
  }

  handleKycSubmit = async () => {
    const { kycAddress } = this.state;
    try {
        await this.kycContract.methods.setKycCompleted(kycAddress).send({from: this.accounts[0]});
        alert("Account " + kycAddress + " is now whitelisted!");
    } catch(error) {
      console.log("ERROR:", error);
    }
  }

  handleBuyToken = async () => {
    await this.asctTokenSales.methods.buyTokens(this.accounts[0]).send({ from: this.accounts[0], value: 100 })
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Ali's Cappucino Token</h1>
        <h2>Enable your account</h2>
        Address to allow: <input type="text" value={this.state.kycAddress} name="kycAddress" onChange={this.onChangeHandler} />
        <button type="button" onClick={this.handleKycSubmit}>Add Address to Whitelist</button>
        <h2>Buy Ali Tokens</h2>
        <p>Send Ether to this address: {this.state.tokenSaleAddress}</p>
        <p>You have: {this.state.userTokens}</p>
        <button type="button" onClick={this.handleBuyToken}>Buy more tokens, each click buys 100 tokens</button>
      </div>
    );
  }
}

export default App;
