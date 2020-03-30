import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import {province} from "./place/province";
import {city} from "./place/city";
import {area} from "./place/area";
//import{ipfsClient} from "ipfs-http-client"
const ipfsClient = require('ipfs-http-client')

// connect to ipfs daemon API server
//const ipfs = ipfsClient('http://localhost:5001') // (the default in Node.js)

// or connect with multiaddr
//const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001')

// or using options
const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })

// or specifying a specific API path
// const ipfs = ipfsClient({ host: '1.1.1.1', port: '80', apiPath: '/ipfs/api/v0' })
class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      //web3对象  用于获取区块链  账号 节点等
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      // 获取到的账号
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      //网络id
      const networkId = await web3.eth.net.getId();
      //合约地址  交易哈希等  通过合约名  网络id获取
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      //合约实例对象 通过这个可以调用合约方法
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <div>
        <input ref="dataInput"
        style={{width:200,height:30}}></input>
        <button onClick={ async ()=>{
          let value = this.refs.dataInput.value;
    
          await this.state.contract.methods.add(Number(value)).send({ from: this.state.accounts[0] });
          const response = await this.state.contract.methods.get().call();
          console.log(response);
          // Update state with the result.
          this.setState({ storageValue: response });
          
          }} style={{width:60,height:30}}>修改</button></div>
         <input ref="searchInput" style={{width:200,height:30}}></input>
         <button onClick={  ()=>{
          console.log(province);
          console.log(city);
          console.log(area);
          let content = this.refs.searchInput.value;
          //ipfs
          }} style={{width:60,height:30}}>提交</button>
      </div>
    );
  }
}

export default App;
