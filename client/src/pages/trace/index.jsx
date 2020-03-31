import React, { Component } from "react";
import './index.less';
import logo from '../../assets/GREEN_TEA.svg'
import banner1 from './image/banner1.jpg'
import banner2 from './image/banner2.jpg'
import { Button } from 'antd';
import { reqTea } from "../../api";
import Tea from "../../contracts/Tea.json";
import getWeb3 from "../../getWeb3";
import SearchTea from "./searchtea";
export class Trace extends Component{
    state = {
        bg : banner1,
        setBg :false,
        web3: null, 
        accounts: null, 
        contract: null,
        width:"100%",
        height:"100%"
    }
    componentDidMount = async () => {
        this.setState({width:document.body.clientWidth,height: document.body.clientHeight})
        //动态修改背景
        this.setBg();
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
    setBg = () =>{
        this.interval = setInterval(()=>{
            let bg ;
          if(this.state.setBg){
            bg = banner1;
          }else{
            bg = banner2;
          }
          this.setState({
            bg:bg,
            setBg:!this.state.setBg
          })
        },7000)
    }
    getDate = async () =>{
       const data= await reqTea();
       const d = data.data.data;
       console.log(d);
       console.log(JSON.stringify(d._id))
       console.log(this.state)
       await this.state.contract.methods.setProduct("5e7f52b6790e9318bc605d80",d.name,d.type_id,d.batch,d.grade,d.period,d.store,d.img,d.qr).send({ from: this.state.accounts[0] });
       const response = await this.state.contract.methods.getProduct("5e7f52b6790e9318bc605d80").call();
       console.log(response);
    }
    render(){
     
        return (
            <div className="main" style ={{height:this.state.height, width:this.state.width,backgroundImage: `url(${this.state.bg})`,backgroundSize:'100% 100%'}}>
                <div className="main-top">
                    <img src={logo} alt="logo"></img>
                    <h1 style = {{color:'#2E8B57'}}>喝好茶</h1>
                    <h1  style = {{fontSize:'40px',marginLeft:'70px'}}>中国茶叶专业追溯防伪平台</h1>
                </div>
                <div className="main-search">
                    <h1>茶类质量安全溯源</h1>
                    <SearchTea></SearchTea>
                    <Button onClick ={this.getDate}>获取</Button>
                    <h2>生产有规程、质量有标准、安全可追溯</h2>
                </div>
                <div className="main-cnav">
                    <div className="main-cnav-item"><a href="/main/brand">品牌</a></div>
                    <div className="main-cnav-item"><a href="/main/news">资讯</a></div>
                    <div className="main-cnav-item"><a href="/main/shop">商城</a></div>
                    <div className="main-cnav-item"><a href="/main/about">关于</a></div>
                </div>
            </div>
        )
    }
}

export default Trace

/*
async和await
1.作用
简化promise对象的使用，消灭了then，不用在使用then（）来指定成功/失败的回调函数
以异步编码方式实现异步流程

2.哪里写await
在返回promise的表达式左侧写await：不想要promise，想要promise异步执行成功的value数据

3.哪里写async
await所在函数（最近的）定义的左侧写async
*/