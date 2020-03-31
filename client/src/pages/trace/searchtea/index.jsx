import React,{Component} from 'react'
import { Input} from 'antd';
import Tea from "../../../contracts/Tea.json";
import getWeb3 from "../../../getWeb3";

const { Search } = Input;

export default class SearchTea extends Component{
    state = {
        web3: null, 
        accounts: null, 
        contract: null,
    }
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
          const deployedNetwork = Tea.networks[networkId];
          //合约实例对象 通过这个可以调用合约方法
          const instance = new web3.eth.Contract(
            Tea.abi,
            deployedNetwork && deployedNetwork.address,
          );
    
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ web3, accounts, contract: instance });
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
      };
    onSearch = async (value, event) =>{
        console.log(this.state)
        const response = await this.state.contract.methods.getProduct(value).call();
        console.log(response);
     }
    render(){
        return(
            <Search
            placeholder="请输入溯源码查询"
            size ="large"
            onSearch={this.onSearch}
            style={{ width: 300 }}
            />
        )
    }
}