import React, { Component } from 'react'
import Tea from "../../../contracts/Tea.json";
import getWeb3 from "../../../getWeb3";
import SearchTea from '../searchtea';
import { Carousel, ConfigProvider, Modal, Table, Card, Col, Row, Collapse, Empty, Spin, Statistic, Button, Tag, Descriptions, Timeline } from 'antd';
import './index.less'
import { CaretRightOutlined } from '@ant-design/icons';
import Plant from '../../../assets/plant.svg'
import TeaIcon from '../../../assets/GREEN_TEA.svg'
import Process from '../../../assets/process.svg'
import Storage from '../../../assets/storage.svg'
import Check from '../../../assets/check.svg'
import Sale from '../../../assets/sale.svg'
import { reqDictionaryByCond } from '../../../api';
import { formateDate } from '../../../utils/dateUtils';
const creatHistory = require("history").createBrowserHistory
const { Panel } = Collapse;
const history = creatHistory();

var _this = null;
var _web3 = null;
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
        tea: null,
        plant: null,
        process: null,
        storage: null,
        check: null,
        sale: null,
        pesticide: null,
        visible: false,
        img: null
    }
    componentDidMount() {
        this.getWeb();
    };
    getWeb = async () => {
        try {
            // Get network provider and web3 instance.
            //web3对象  用于获取区块链  账号 节点等
            const web3 = await getWeb3();
            // Use web3 to get the user's accounts.
            // 获取到的账号
            if (web3) {
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
                _contract = instance;
                const id = this.props.location.state.id;
                this.getId(id)
            }
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }
    /*使用reduce()+递归调用 */
    getTimeLine = () => {
        const pesticide = this.state.pesticide
        let i = 0;
        return pesticide.name.reduce((pre, item) => {

            if (i === pesticide.date.length - 1) {
                pre.push((
                    <Timeline.Item style={{ height: "16px" }} key={i}>{formateDate(Number(pesticide.date[i]))}<span>{item}</span></Timeline.Item>
                ))
            } else {
                pre.push((
                    <Timeline.Item key={i}>{formateDate(Number(pesticide.date[i]))}<span>{item}</span></Timeline.Item>
                ))
            }
            i++
            return pre
        }, [])
    }
    getProcessCard = () => {
        const process = this.state.process
        let i = 0;
        let start = 0;
        if (!process) {
            return <Spin tip="正在查询中..." style={{ textAlign: "center" }} />
        }
        if (process.method.length > 0) {
            return process.method.reduce((pre, item) => {
                
                pre.push((
                    <Col span={8} key={i}>
                        <Card hoverable>
                            <Carousel style={{ backgroundColor: "#364d79" }} autoplay>
                                {this.getImgCarousel(process.img.slice(start,start+process.num[i]))}
                            </Carousel>
                            <h1>加工方法:{item}</h1>
                            <h1>开始日期:{formateDate(Number(process.startDate[i]))}</h1>
                            <h1>结束日期:{formateDate(Number(process.endDate[i]))}</h1>
                            <h1>负责人:{process.processer[i]}</h1>
                        </Card>
                    </Col>
                ))
                i++
                start = start+process.num[i]
                return pre
            }, [])
        } else {
            console.log("111")
            return <h1>暂无数据</h1>
        }
    }
    getId = async (id) => {
        if (!this.state.tea) {
            const response = await _contract.methods.getProduct(id).call();
            if (response.id) {
                const grade = await reqDictionaryByCond("grade", response.grade);
                const typeId = await reqDictionaryByCond("type", response.typeId);
                const typeIdP = await reqDictionaryByCond("type", response.typeId.substring(0, 4) + "00");
                if (grade.data.data.length > 0) {
                    response.grade = grade.data.data[0].valueName;
                }
                if (typeId.data.data.length > 0) {
                    response.typeId = typeId.data.data[0].valueName;
                }
                if (typeId.data.data.length > 0) {
                    response.typeId = typeIdP.data.data[0].valueName + "-" + response.typeId
                }
                this.setState({ hasResult: true, tea: response })
            }
            deadline = Date.now() + 1000 * 5;
            this.setState({
                id: id
            })
        }
        _id = id
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (_web3) {
            if (_id && nextProps.location.state.id !== prevState.id) {
                _this.getId(nextProps.location.state.id)
            }
        } else {
            _this.getWeb()
        }
        return null;
    }
    onChange = async (activeKey) => {
        const id = this.state.id;
        if (activeKey.indexOf("plant") !== -1) {
            if (!this.state.plant) {
                const plant = await this.state.contract.methods.getPlant(id).call();
                const place = await reqDictionaryByCond("place_origin", plant.place);
                const placeP = await reqDictionaryByCond("place", plant.place);
                if (place.data.data.length > 0) {
                    plant.place = place.data.data[0].valueName;
                }
                if (placeP.data.data.length > 0) {
                    plant.place = placeP.data.data[0].valueName + "-" + plant.place
                }
                const pesticide = await this.state.contract.methods.getPesticide(id).call();
                for (let i = 0; i < pesticide.name.length; i++) {
                    let name = await reqDictionaryByCond("pesticide", pesticide.name[i]);
                    if (name.data.data.length > 0) {
                        pesticide.name[i] = name.data.data[0].valueName
                    }

                }
                this.setState({ plant: plant, pesticide: pesticide })
            }
        }
        if (activeKey.indexOf("process") !== -1) {
            if (!this.state.process) {
                const process = await this.state.contract.methods.getProcess(id).call();
                for (let i = 0; i < process.method.length; i++) {
                    let method = await reqDictionaryByCond("process", process.method[i]);
                    if (method.data.data.length > 0) {
                        process.method[i] = method.data.data[0].valueName
                    }
                }
                this.setState({ process: process })
            }
        }
        if (activeKey.indexOf("storage") !== -1) {
            if (!this.state.storage) {
                const storage = await this.state.contract.methods.getStorage(id).call();
                const splace = await reqDictionaryByCond("warehouse", storage.place);
                const splaceP = await reqDictionaryByCond("place", storage.place);
                if (splace.data.data.length > 0) {
                    storage.place = splace.data.data[0].valueName;
                }
                if (splaceP.data.data.length > 0) {
                    storage.place = splaceP.data.data[0].valueName + "-" + storage.place
                }
                this.setState({ storage: storage })
            }
        }
        if (activeKey.indexOf("check") !== -1) {
            if (!this.state.check) {
                const response = await this.state.contract.methods.getCheck(id).call();
                let check = []
                for (let i = 0; i < response.typeId.length; i++) {
                    let typeId = await reqDictionaryByCond("check", response.typeId[i]);
                    let result = await reqDictionaryByCond("result", response.result[i]);
                    if (typeId.data.data.length > 0) {
                        response.typeId[i] = typeId.data.data[0].valueName
                    }
                    if (result.data.data.length > 0) {
                        response.result[i] = result.data.data[0].valueName
                    }
                    let c = {};
                    c.typeId = response.typeId[i];
                    c.date = response.date[i];
                    c.result = response.result[i];
                    c.info = response.info[i];
                    c.checker = response.checker[i];
                    c.index = i;
                    check[i] = c;
                }
                this.setState({ check: check })
            }
        }
        if (activeKey.indexOf("sale") !== -1) {
            if (!this.state.sale) {
                const sale = await this.state.contract.methods.getSale(id).call();
                const method = await reqDictionaryByCond("sale", sale.place);
                if (method.data.data.length > 0) {
                    sale.method = method.data.data[0].valueName;
                }
                this.setState({ sale: sale })
            }
        }
    }
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    getPlantDescriptions = () => {
        if (!this.state.plant) {
            return <Spin tip="正在查询中..." style={{ textAlign: "center" }} />
        }
        if (this.state.plant.place) {
            return <Descriptions title="种植阶段信息" column={2}>
                <Descriptions.Item label="产地">{this.state.plant.place}</Descriptions.Item>
                <Descriptions.Item label="种植负责人">{this.state.plant.planter}</Descriptions.Item>
                <Descriptions.Item label="阶段图">
                    <Button type="link" onClick={() => { this.setState({ visible: true, img: this.state.plant.img }) }}>查看详情</Button>
                </Descriptions.Item>
                <Descriptions.Item label="施药记录" style={{ display: "flex", alignItems: 'center' }}>
                    <Timeline >
                        {this.getTimeLine()}
                    </Timeline>
                </Descriptions.Item>
            </Descriptions>
        } else {
            return <h1>暂无数据</h1>
        }
    }
    getStorageDescriptions = () => {
        if (!this.state.storage) {
            return <Spin tip="正在查询中..." style={{ textAlign: "center" }} />
        }
        if (this.state.storage.place) {
            return <Descriptions title="仓储阶段信息">
                <Descriptions.Item label="地点">{this.state.storage.place}</Descriptions.Item>
                <Descriptions.Item label="开始日期">{formateDate(Number(this.state.storage.startDate))}</Descriptions.Item>
                <Descriptions.Item label="结束日期">{formateDate(Number(this.state.storage.endDate))}</Descriptions.Item>
                <Descriptions.Item label="仓储负责人">{this.state.storage.storageer}</Descriptions.Item>
                <Descriptions.Item span={2} label="阶段图">
                <Button type="link" onClick={() => { this.setState({ visible: true, img: this.state.storage.img }) }}>查看详情</Button>
                </Descriptions.Item>
            </Descriptions>
        } else {
            return <h1>暂无数据</h1>
        }
    }
    getSaleDescriptions = () => {
        if (!this.state.sale) {
            return <Spin tip="正在查询中..." style={{ textAlign: "center" }} />
        }
        if (this.state.sale.place) {
            return <Descriptions title="售卖阶段信息" column={2}>
                <Descriptions.Item label="售卖地点">{this.state.sale.place}</Descriptions.Item>
                <Descriptions.Item label="售卖方式">{this.state.sale.method}</Descriptions.Item>
                <Descriptions.Item label="售卖日期">{formateDate(Number(this.state.sale.date))}</Descriptions.Item>
                <Descriptions.Item label="售卖负责人">{this.state.sale.saleer}</Descriptions.Item>
            </Descriptions>
        } else {
            return <h1>暂无数据</h1>
        }
    }
    getImgCarousel = (imgList) => {
        let i = 0
        if (Array.isArray(imgList)) {
            return imgList.reduce((pre, item) => {
                pre.push((
                    <div key={i++}>
                        <img alt="img" style={{ width: "470px", height: "300px" }} src={global.ipfs.uri + item}></img>
                    </div>
                ))
                return pre
            }, [])
        } else {
            return <img alt="img" src={global.ipfs.uri + imgList}></img>
        }

    }
    render() {
        const customizeRenderEmpty = () => (
            !this.state.check ? (
                <div style={{ textAlign: 'center' }}>
                    <Spin tip="正在查询中..." style={{ textAlign: "center" }} />
                </div>) : (
                    <div><h1 style={{ textAlign: "center" }}>暂无数据</h1></div>
                )
        );
        const columns = [
            {
                title: '检测类型',
                dataIndex: 'typeId',

            },
            {
                title: '检测日期',
                dataIndex: 'date',

                render: date => formateDate(Number(date))
            },
            {
                title: '检测结果',
                dataIndex: 'result',

            },
            {
                title: '检测详情',
                dataIndex: 'info',

                render: (text, record) =>
                    this.state.check.length >= 1 ? (
                        <Button type="link" onClick={() => { this.setState({ visible: true, img: text }) }}>查看详情</Button>
                    ) : null,
            },
            {
                title: '检测负责人',
                dataIndex: 'checker',

            },
        ]
        const back = <h1>秒后完成跳转，或直接点击<Button onClick={onFinish} type="link" >这里</Button>返回</h1>;
        return (
            <div className="result">

                <Modal
                    title="详情图"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >   <Carousel style={{ backgroundColor: "#364d79" }} autoplay>
                        {this.getImgCarousel(this.state.img)}
                    </Carousel>
                </Modal>
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
                                <Collapse
                                    bordered={false}
                                    defaultActiveKey={['tea']}
                                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                    className="result-center-collapse"
                                    onChange={this.onChange}
                                >

                                    <Panel header="茶叶基本信息" key="tea" className="result-center-collapse-custom-panel" extra={<img alt ="plant"style={{ height: "20px" }} src={TeaIcon}></img>}>
                                        <Descriptions title="茶叶信息">
                                            <Descriptions.Item label="溯源码">{this.state.tea.id}</Descriptions.Item>
                                            <Descriptions.Item label="名字">{this.state.tea.name}</Descriptions.Item>
                                            <Descriptions.Item label="类型">{this.state.tea.typeId}</Descriptions.Item>
                                            <Descriptions.Item label="批次">{this.state.tea.batch}</Descriptions.Item>
                                            <Descriptions.Item label="产品等级">
                                                {this.state.tea.grade}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="保质期">{this.state.tea.period}</Descriptions.Item>
                                            <Descriptions.Item label="存储条件">{this.state.tea.store}</Descriptions.Item>
                                            <Descriptions.Item label="二维码"><img alt="二维码" style={{ height: "60px" }} src={global.ipfs.uri + this.state.tea.qr}></img></Descriptions.Item>
                                            <Descriptions.Item label="产品图">
                                            <Button type="link" onClick={() => { this.setState({ visible: true, img: this.state.tea.img }) }}>查看详情</Button>
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Panel>
                                    <Panel header="种植阶段" key="plant" className="result-center-collapse-custom-panel" extra={<img alt ="plant" style={{ height: "20px" }} src={Plant}></img>}>
                                        {this.getPlantDescriptions()}
                                    </Panel>
                                    <Panel header="加工阶段" key="process" className="result-center-collapse-custom-panel" extra={<img alt ="process"  style={{ height: "20px" }} src={Process}></img>}>
                                        <Row gutter={16}>
                                            {this.getProcessCard()}
                                        </Row>
                                    </Panel>
                                    <Panel header="仓储阶段" key="storage" className="result-center-collapse-custom-panel" extra={<img alt ="storage"  style={{ height: "20px" }} src={Storage}></img>}>
                                        {this.getStorageDescriptions()}
                                    </Panel>
                                    <Panel header="检测阶段" key="check" className="result-center-collapse-custom-panel" extra={<img alt ="check"  style={{ height: "20px" }} src={Check}></img>}>
                                        <ConfigProvider renderEmpty={customizeRenderEmpty}>
                                            <Table rowKey={record => record.index} columns={columns} dataSource={this.state.check} />
                                        </ConfigProvider>
                                    </Panel>
                                    <Panel header="售卖阶段" key="sale" className="result-center-collapse-custom-panel" extra={<img alt ="sale" style={{ height: "20px" }} src={Sale}></img>}>
                                        {this.getSaleDescriptions()}
                                    </Panel>
                                </Collapse>
                            </div>
                        ) : <div>
                                <Empty description="暂无数据" />
                                <Countdown title="溯源码可能是错误的" prefix="系统将在" suffix={back} format="s" value={deadline} onFinish={onFinish} />
                            </div>) : (
                                <div>
                                    <Spin tip="正在查询中..." style={{ textAlign: "center" }} />
                                    <div>
                                        <Tag style={{ marginTop: "10px" }} color="#87d068">如若长时间未查询到结果，请尝试手动刷新</Tag>
                                    </div>
                                </div>
                            )
                    }
                </div>

            </div >

        )
    }
}