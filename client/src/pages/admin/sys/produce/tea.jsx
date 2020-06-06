import React, { Component } from 'react'
import { Button, Table, PageHeader, Modal, Carousel, Collapse, Row, Col, Descriptions, Popconfirm, Divider, message} from 'antd'
import { reqPageTea, reqDictType, reqDeleteTea } from '../../../../api'
import { FileImageTwoTone } from '@ant-design/icons';
import Plant from '../../../../assets/plant.svg'
import Process from '../../../../assets/process.svg'
import Storage from '../../../../assets/storage.svg'
import Check from '../../../../assets/check.svg'
import moment from 'moment';
import EditTea from './editTea';
import getWeb3 from '../../../../getWeb3';
import TeaJson from "../../../../contracts/Tea.json";
import SetTea from './setTea';
const { Panel } = Collapse;
export default class Tea extends Component {
    constructor(props) {
        super(props)
        const { state } = this.props.location
        if (state && state.produce) {
            let cond = {
                produce: state.produce.id
            }
            this.getDate(1, 10, cond)
            this.getDict(["type", "pesticide", "grade", "result", "check", "process"])
            this.getWeb3Tea()
        } else {
            this.props.history.goBack()
        }
    }
    state = {
        teaList: [],
        searchText: '',
        searchedColumn: '',
        selectedRowKeys: [],
        tea: {},
        setVisible: false,
        type: "",
        editVisible: false,
        setType: "",
        dict: {},
        cond: {},
        web3: null,
        accounts: null,
        contract: null,
    }
    getDate = async (page, rows, cond) => {
        const res = await reqPageTea(page, rows, cond)
        if (res.data.data) {
            const teaList = res.data.data
            cond = cond ? cond : {}
            this.setState({ teaList, tea: {}, cond })
        }
    }
    getDict = async (typeCode) => {
        const res = await reqDictType(typeCode)
        const dict = res.data.data
        this.setState({ dict })
    }
    getDictValue = (name, id) => {
        const { dict } = this.state
        if (dict[name] && Array.isArray(dict[name])) {
            const result = dict[name].find(item => item.valueId === id)
            if (result) {
                return result.valueName
            } else {
                return id
            }
        }
    }
    getWeb3Tea = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = TeaJson.networks[networkId];
            const instance = new web3.eth.Contract(
                TeaJson.abi,
                deployedNetwork && deployedNetwork.address,
            );
            this.setState({ web3, accounts, contract: instance });
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }
    sava =async () => {
        const { contract, web3 } = this.state
        if (contract && web3) {
            const { tea } = this.state
            tea.id = tea.id ? tea.id : ""
            tea.name = tea.name ? tea.name : ""
            tea.typeId = tea.typeId ? tea.typeId : ""
            tea.batch = tea.batch ? tea.batch : ""
            tea.produce = tea.produce ? tea.produce : ""
            tea.grade = tea.grade ? tea.grade : ""
            tea.period = tea.period ? tea.period : ""
            tea.store = tea.store ? tea.store : ""
            tea.img = tea.img ? tea.img :[]
            tea.qr = tea.qr ? tea.qr : ""
            await contract.methods.setProduct(tea.id, tea.name, tea.typeId, tea.batch, tea.produce).send({ from: this.state.accounts[0] });
            await contract.methods.setProductSenior(tea.id, tea.grade, tea.period, tea.store, tea.img, tea.qr).send({ from: this.state.accounts[0] });
        } else {
            this.getWeb3Tea()
        }
    }
    addEdit = (produce, type) => {
        const { dict } = this.state
        this.props.history.push("/admin/produce/edit", { produce: produce, type, dict, editType: 'sys' })
    }
    handleDelete = async (record) => {
        await reqDeleteTea(record.id)
        message.success("删除成功")
        this.getDate(this.state.produceList.page, this.state.produceList.rows, this.state.cond)
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, tea: selectedRows[0] });
    };
    expandedRowRender = (record) => {
        const columns = [
            { title: '农药名', dataIndex: 'name', key: 'name', render: (text) => this.getDictValue("pesticide", text) },
            { title: '施药时间', dataIndex: 'date', key: 'date', render: (text) => moment(text).format("lll") },
        ];
        const processColumns = [
            { title: '加工方法', dataIndex: 'method', key: 'method', render: (text) => this.getDictValue('process', text) },
            { title: '开始时间', dataIndex: 'startDate', key: 'batstartDatech', render: (text) => text ? moment(text).format("lll") : "" },
            { title: '结束时间', dataIndex: 'endDate', key: 'endDate', render: (text) => text ? moment(text).format("lll") : "" },
            { title: '负责人账户', dataIndex: 'staffName', key: 'staffName' },
            { title: '负责人真实姓名', dataIndex: 'staffRealName', key: 'staffRealName' },
            { title: '是否完成', dataIndex: 'finish', key: 'finish', render: (text) => text ? "是" : "否" },
            { title: '阶段图', dataIndex: 'img', key: 'img', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}>查看详情</Button> },
            { title: '操作', dataIndex: 'processer', render: (text, r, index) => <Button type="link" size="middle" onClick={() => this.setState({ setVisible: true, tea: record, setType: 'process', index })}>编辑</Button> }
        ];
        const checkColumns = [
            { title: '检测类型', dataIndex: 'typeId', key: 'typeId', render: (text) => this.getDictValue('check', text) },
            { title: '时间', dataIndex: 'date', key: 'date', render: (text) => text ? moment(text).format("lll") : "" },
            { title: '结果', dataIndex: 'result', key: 'result', render: (text) => this.getDictValue('result', text) },
            { title: '负责人账户', dataIndex: 'staffName', key: 'staffName' },
            { title: '负责人真实姓名', dataIndex: 'staffRealName', key: 'staffRealName' },
            { title: '是否完成', dataIndex: 'finish', key: 'finish', render: (text) => text ? "是" : "否" },
            { title: '具体详情', dataIndex: 'info', key: 'img', render: (text, record, index) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}>查看详情</Button> },
            { title: '操作', dataIndex: 'checker', render: (text, r, index) => <Button type="link" size="middle" onClick={() => this.setState({ setVisible: true, tea: record, setType: 'check', index })}>编辑</Button> }
        ];
        const plant = record.plant ? record.plant : {}
        const process = record.process ? record.process : []
        const storage = record.storage ? record.storage : {}
        const check = record.check ? record.check : []
        const data = plant.pesticide ? plant.pesticide : []
        return (
            <Collapse
                bordered={false}
                className="result-center-collapse"
            >
                <Panel header="种植阶段" key="plant" className="result-center-collapse-custom-panel" extra={<div> <Button onClick={() => this.setState({ setVisible: true, tea: record, setType: 'plant' })} type="link">设置负责人</Button> <img alt="plant" style={{ height: "20px" }} src={Plant}></img></div>}>
                    <Row>
                        <Col span={12}>
                            <Descriptions column={1} bordered size="small">
                                <Descriptions.Item label="产地">{plant.place}</Descriptions.Item>
                                <Descriptions.Item label="负责人账户">{plant.staffName}</Descriptions.Item>
                                <Descriptions.Item label="负责人真实姓名">{plant.staffRealName}</Descriptions.Item>
                                <Descriptions.Item label="施药次数">{data.length}</Descriptions.Item>
                                <Descriptions.Item label="阶段图"> <Button style={{ padding: "0" }} type="link" onClick={() => this.setState({ visible: true, img: plant.img })}>查看详情</Button></Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col span={12}>
                            <Table rowKey="date" columns={columns} dataSource={data} pagination={false} />
                        </Col>
                    </Row>
                </Panel>
                <Panel header="加工阶段" key="process" className="result-center-collapse-custom-panel" extra={<div><Button type="link" onClick={() => this.setState({ setVisible: true, tea: record, setType: 'process', index: -1 })} >新增</Button> <img alt="process" style={{ height: "20px" }} src={Process}></img></div>}>
                    <Table title={(c) => record.processFinish ? "已完成加工阶段" : "未完成加工阶段"} rowKey="startDate" columns={processColumns} dataSource={process} pagination={false} />
                </Panel>
                <Panel header="仓储阶段" key="storage" className="result-center-collapse-custom-panel" extra={<div><Button type="link" onClick={() => this.setState({ setVisible: true, tea: record, setType: 'storage' })} >设置负责人</Button> <img alt="storage" style={{ height: "20px" }} src={Storage}></img></div>}>
                    <Descriptions title="仓储记录">
                        <Descriptions.Item label="仓储地点">{storage.place}</Descriptions.Item>
                        <Descriptions.Item label="开始时间">{storage.startDate ? moment(storage.startDate).format("lll") : ""}</Descriptions.Item>
                        <Descriptions.Item label="结束时间">{storage.endDate ? moment(storage.endDate).format("lll") : ""}</Descriptions.Item>
                        <Descriptions.Item label="负责人账户">{storage.staffName}</Descriptions.Item>
                        <Descriptions.Item label="负责人真实姓名">{storage.staffRealName}</Descriptions.Item>
                        <Descriptions.Item label="是否完成">{storage.finish ? "是" : "否"}</Descriptions.Item>
                        <Descriptions.Item label="阶段图"><Button type="link" onClick={() => this.setState({ visible: true, img: storage.img })}>查看详情</Button></Descriptions.Item>
                    </Descriptions>
                </Panel>
                <Panel header="检测阶段" key="check" className="result-center-collapse-custom-panel" extra={<div><Button type="link" onClick={() => this.setState({ setVisible: true, tea: record, setType: 'check', index: -1 })}>新增</Button><img alt="check" style={{ height: "20px" }} src={Check}></img></div>}>
                    <Table title={(c) => record.checkFinish ? "已完成检测阶段" : "未完成检测阶段"} rowKey="date" columns={checkColumns} dataSource={check} pagination={false} />
                </Panel>
            </Collapse>
        );
    };
    getCarousel(img) {
        if (Array.isArray(img)) {
            let i = 0
            return img.reduce((pre, item) => {
                pre.push((
                    <div key={i++}>
                        <img alt="img" style={{ width: "470px", height: "300px" }} src={global.ipfs.uri + item}></img>
                    </div>
                ))
                return pre
            }, [])
        } else if (img) {
            return <div><img alt="img" src={global.ipfs.uri + img}></img> </div>
        } else {
            return <div>暂无图片</div>
        }
    }
    render() {
        const { teaList, visible, img, cond, selectedRowKeys, index, tea, type, editVisible, dict, setVisible, setType } = this.state
        let t = ""
        if (setType === 'plant') {
            t = "种植阶段"
        } else if (setType === 'process') {
            t = "加工阶段"
        } else if (setType === 'storage') {
            t = "仓储阶段"
        } else if (setType === 'check') {
            t = "检测阶段"
        }
        const columns = [
            { title: '茶叶名', dataIndex: 'name', key: 'name' },
            { title: '批次', dataIndex: 'batch', key: 'batch' },
            { title: '保质期', dataIndex: 'period', key: 'period' },
            { title: '产品等级', dataIndex: 'grade', key: 'grade', render: (text) => this.getDictValue('grade', text) },
            { title: '存储条件', dataIndex: 'store', key: 'store' },
            { title: '二维码', dataIndex: 'qr', key: 'qr', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}><FileImageTwoTone /></Button> },
            { title: '产品图', dataIndex: 'img', key: 'img', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}><FileImageTwoTone /></Button> },
            {
                title: '操作',
                dataIndex: 'staffRole',
                width: 180,
                render: (text, record) => {
                    return (<Row>
                        <Button size="middle" onClick={() => this.setState({ editVisible: true, tea: record, type: 'edit' })}>编辑</Button>
                        <Divider type="vertical"></Divider>
                        <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record)}>
                            <Button size="middle" type="danger">删除</Button>
                        </Popconfirm>
                    </Row>)
                }
            },
        ];
        const paginationProps = {
            showQuickJumper: true,
            showTotal: () => `共${teaList.total}条`,
            total: teaList.total,
            onChange: (current) => this.getDate(current, teaList.rows, cond),
        };
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: "radio"
        };
        const title = (
            <div style={{ margin: "10px 0" }}>
                <Button type="primary" onClick={() => this.setState({ editVisible: true, tea: {}, type: 'add' })} style={{ marginRight: "20px" }}>新增茶叶</Button>
                <Button type="primary" href={global.service.uri + 'tea/downloadQR?id=' + tea.id + '&name=' + tea.name + '-' + tea.batch} style={{ marginRight: "20px" }} disabled={!selectedRowKeys.length}>生成二维码</Button>
                <Button type="primary" onClick={() => this.sava()} style={{ marginRight: "20px" }} disabled={!selectedRowKeys.length}>保存至区块链</Button>
            </div>
        )
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    onBack={() => this.props.history.goBack()}
                    title="产品茶叶"
                />
                {title}
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    rowKey="id"
                    rowSelection={rowSelection}
                    expandable={{ expandedRowRender: this.expandedRowRender }}
                    pagination={paginationProps}
                    dataSource={teaList.content}
                />
                <Modal
                    title="详情图"
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                    footer={[
                        <Button key="back" onClick={() => this.setState({ visible: false })}>
                            确认
                        </Button>
                    ]}
                    bodyStyle={{ backgroundColor: "white" }}
                >   <Carousel style={{ backgroundColor: "white" }} autoplay>
                        {this.getCarousel(img)}
                    </Carousel>
                </Modal>

                <Modal
                    title={type === 'add' ? "新增茶叶" : "编辑茶叶"}
                    visible={editVisible}
                    footer={null}
                    bodyStyle={{ backgroundColor: "white" }}
                    onCancel={() => { this.setState({ editVisible: false }) }}
                >
                    <EditTea produce={this.props.location.state.produce} dict={dict} type={type} tea={tea} hideModal={() => {
                        this.setState({ editVisible: false })
                        this.getDate(1, 10, this.state.cond)
                    }}></EditTea>
                </Modal>

                <Modal
                    title={t}
                    visible={setVisible}
                    footer={null}
                    bodyStyle={{ backgroundColor: "white" }}
                    onCancel={() => { this.setState({ setVisible: false }) }}
                >
                    <SetTea produce={this.props.location.state.produce} dict={dict} setType={setType} tea={tea} index={index} hideModal={() => {
                        this.setState({ setVisible: false })
                        this.getDate(1, 10, this.state.cond)
                    }}></SetTea>
                </Modal>
            </div>
        )
    }
}