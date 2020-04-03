import React, { Component } from 'react'
import Tea from "../../../contracts/Tea.json";
import getWeb3 from "../../../getWeb3";
import SearchTea from '../searchtea';
import { Empty ,Spin,Statistic,Button, Tag} from 'antd';
import './index.less'

const creatHistory = require("history").createBrowserHistory
const history = creatHistory();
var _this = null;
var _web3 = null;
var _accounts = null;
var _contract = null;
var _id = false;
const { Countdown } = Statistic;
var deadline = Date.now() + 1000 * 5; // Moment is also OK

function onFinish() {
  history.goBack();
}
export default class TeaResult extends Component {
    constructor() {
        super();
        _this = this
    }
    state = {
        web3: null,
        accounts: null,
        contract: null,
        id: false,
        hasResult: false,
    }
    componentDidMount = async () => {
       this.getWeb();
    }; 
    getWeb = async () =>{
        console.log("sdsd")
        try {
            console.log("try")
            // Get network provider and web3 instance.
            //web3对象  用于获取区块链  账号 节点等
            const web3 = await getWeb3();
            // Use web3 to get the user's accounts.
            // 获取到的账号
            if(web3){
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
            _web3 = web3;
            _accounts = accounts;
            _contract = instance;
            const id = this.props.location.state.id;
            console.log(web3,"will")
            this.getId(id)
            }
            
            //   const  response1 = await this.state.contract.methods.getPlant(id).call();
            //   console.log(response1);
            //   const response2 = await this.state.contract.methods.getPesticide(id).call();
            //   console.log(response2);
            //   const response3 = await this.state.contract.methods.getProcess(id).call();
            //   console.log(response3);
            //   const response4 = await this.state.contract.methods.getStorage(id).call();
            //   console.log(response4);
            //   const response5 = await this.state.contract.methods.getCheck(id).call();
            //   console.log(response5);
            //   const response6 = await this.state.contract.methods.getSale(id).call();
            //   console.log(response6);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }
    getId = async (id) => {
        const response = await _contract.methods.getProduct(id).call();
        if (response.id) {
            this.setState({
                hasResult: true
            })
        }
        deadline = Date.now() + 1000 * 5;
        this.setState({
            id: id
        })
        console.log(this.state.id)
        _id = id
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(_web3){
            if (_id && nextProps.location.state.id !== prevState.id) {
                _this.getId(nextProps.location.state.id)
            }
        }else{
            console.log(_web3,_this)
            _this.getWeb()
        }
        console.log(_id,nextProps.location.state.id ,prevState.id)
        return null;
    }
    render() {
        const back = <h1>秒后完成跳转，或直接点击<Button onClick={onFinish} type="link" >这里</Button>返回</h1>;
        return (
            <div className="result">
                <div className="result-top">
                    <div className="result-top-left">
                        <h1>查询结果</h1>
                        <span>/</span>
                        <span>溯源码查询结果</span>
                    </div>
                    <div className="result-top-right">
                        <SearchTea></SearchTea>
                    </div>
                </div>
                <div className="result-center">
                    {
                        this.state.id ? (this.state.hasResult ? (
                            <div>
                                <h1>▶茶叶基本信息▼▼</h1>
                                {this.state.id}
                            </div>
                        ) : <div>
                                <Empty description="暂无数据"/>
                                <Countdown title="溯源码可能是错误的" prefix="系统将在" suffix={back} format="s" value={deadline} onFinish={onFinish} />
                            </div>) : (
                                <div>
                                <Spin tip="正在查询中..." style={{ textAlign: "center"}}/>
                                <div>
                                <Tag style={{marginTop:"10px"}} color="#87d068">如若长时间未查询到结果，请尝试手动刷新</Tag>
                                </div>
                                </div>
                            )
                    }
                </div>

            </div>

        )
    }
}