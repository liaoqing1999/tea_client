import React,{Component} from 'react'
import { Input, message} from 'antd';
import Tea from "../../../contracts/Tea.json";
import getWeb3 from "../../../getWeb3";
import { reqTea } from '../../../api';
import { withRouter } from 'react-router-dom';

const { Search } = Input;

 class SearchTea extends Component{
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
        if(value){
          this.props.history.push('/main/result',{id : value})
        }else{
          message.error("请输入溯源码")
        }
       
     }
     onClick = async() =>{
      const data = await reqTea();
      const tea = data.data.data;
      const plant =tea.plant;
      const pesticide = plant.pesticide;
      const process = tea.process;
      const storage = tea.storage;
      const check = tea.check;
      const sale = tea.sale;
      console.log(tea);
      console.log(new Date(pesticide[0].date).valueOf())
      await this.state.contract.methods.setProduct(tea.id,tea.name,tea.typeId,tea.batch,tea.grade,tea.period,tea.store,tea.img,tea.qr).send({ from: this.state.accounts[0] });
      await this.state.contract.methods.setPlant(tea.id,plant.place,plant.planter,plant.img).send({ from: this.state.accounts[0] });
      for(let i = 0;i<pesticide.length;i++){
        await this.state.contract.methods.setPesticide(tea.id,pesticide[i].name,new Date(pesticide[i].date).valueOf()).send({ from: this.state.accounts[0] });
      }
      for(let i = 0;i<process.length;i++){
        console.log(process[i].img)
        await this.state.contract.methods.setProcess(tea.id,process[i].method,new Date(process[i].startDate).valueOf(),new Date(process[i].endDate).valueOf(),process[i].processer,process[i].img).send({ from: this.state.accounts[0] });
      }
      await this.state.contract.methods.setStorage(tea.id,storage.place,new Date(storage.startDate).valueOf(),new Date(storage.endDate).valueOf(),storage.storageer,storage.img).send({ from: this.state.accounts[0] });
      for(let i = 0;i<check.length;i++){
        await this.state.contract.methods.setCheck(tea.id,check[i].typeId,new Date(check[i].date).valueOf(),check[i].result,check[i].info,check[i].checker).send({ from: this.state.accounts[0] });
      }
      await this.state.contract.methods.setSale(tea.id,sale.place,sale.method,new Date(sale.date).valueOf(),sale.saleer).send({ from: this.state.accounts[0] });
     }
    render(){
        return(
          <div>
            <Search
            placeholder="请输入溯源码查询"
            size ="large"
            onSearch={this.onSearch}
            style={{ width: 300 }}
            />
            </div>
        )
    }
}

export default withRouter(SearchTea)