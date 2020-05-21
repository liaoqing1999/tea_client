import React from "react";
import moment from 'moment';
import { Table, Tag, Descriptions, Button, Collapse, Pagination, Row, Upload, Alert, Popconfirm, Divider, Modal, Carousel, message } from 'antd'
import { reqUpdateCheck, reqGetCheck } from "../../../../api";
import memoryUtils from "../../../../utils/memoryUtils";
import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons';
import { addImg } from "../../../../api/ipfs";
import getWeb3 from '../../../../getWeb3';
import Tea from "../../../../contracts/Tea.json";
import EditCheck from "./editCheck";
const { Panel } = Collapse;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export default class UFCheck extends React.Component {
    state = {
        ufCheck: {},
        img: [],
        index: 0,
        visible: false,
        tea: {},
        editImg: false,
        imgFileList: [],
        imgFile: [],
        web3: null,
        accounts: null,
        contract: null,
    }
    componentDidMount = () => {
        this.getCheck(1, 3, false)
        this.getWeb3Tea()
    }
    componentWillReceiveProps(nextProps) {
        this.getCheck(1, 3, false)
    }
    getWeb3Tea = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Tea.networks[networkId];
            const instance = new web3.eth.Contract(
                Tea.abi,
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
    finishCheck = async (tea) => {
        tea.checkFinish = true
        const res = await reqUpdateCheck(tea)
        if (res.data.data.id) {
            const { contract } = this.state
            const tea = res.data.data
            const check = tea.check;
            if (Array.isArray(check) && check.length > 0) {
                for (let i = 0; i < check.length; i++) {
                    check[i].typeId = check[i].typeId ? check[i].typeId : ""
                    check[i].date = check[i].date ? check[i].date : new Date()
                    check[i].result = check[i].result ? check[i].result : ""
                    check[i].info = check[i].info ? check[i].info : ""
                    check[i].checker = check[i].checker ? check[i].checker : ""
                    check[i].finish = check[i].finish ? check[i].finish : true
                    await contract.methods.setCheck(tea.id, check[i].typeId, new Date(check[i].date).valueOf(), check[i].result, check[i].info, check[i].checker, check[i].finish).send({ from: this.state.accounts[0] });
                }
            }
            this.props.addRefresh()
            message.success("任务完成！")
        }
    }
    getCheck = async (page, rows, finish) => {
        const user = memoryUtils.user
        const res = await reqGetCheck(page, rows, user.id, finish)
        const ufCheck = res.data.data
        this.setState({ ufCheck })
    }
    getUFProcess = () => {
        const { ufCheck } = this.state
        const user = memoryUtils.user
        if (ufCheck) {
            if (Array.isArray(ufCheck.content)) {
                return ufCheck.content.reduce((pre, item) => {
                    const extra = (
                        <div>
                            <span style={{ marginRight: "10px" }}>批次:{item.batch}</span>
                            <Popconfirm title="确定完成此任务吗?" onConfirm={() => {
                                this.finishCheck(item)
                            }}>
                                <Button type="primary">完成</Button>
                            </Popconfirm>
                        </div>
                    )
                    const columns = [
                        { title: '检测类型', dataIndex: 'typeId', key: 'typeId', render: (text) => this.getDictValue('check', text) },
                        { title: '时间', dataIndex: 'date', key: 'date', render: (text) => text ? moment(text).format("lll") : "" },
                        { title: '结果', dataIndex: 'result', key: 'result', render: (text) => this.getDictValue('result', text) },
                        { title: '是否完成', dataIndex: 'finish', key: 'finish', render: (text) => text ? "是" : "否" },
                        { title: '具体详情', dataIndex: 'info', key: 'img', render: (text, record, index) => <Button type="link" onClick={() => this.imgView(item, index)}>查看详情</Button> },
                        {
                            title: '操作',
                            dataIndex: 'checker',
                            width: 180,
                            render: (text, record, index) => {
                                if (text === user.id) {
                                    return (<Row>
                                        <Button size="middle" onClick={() => this.setState({ editVisible: true, tea: item, index })}>编辑</Button>
                                        <Divider type="vertical"></Divider>
                                        <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(item, index)}>
                                            <Button size="middle" type="danger">删除</Button>
                                        </Popconfirm>
                                    </Row>)
                                } else {
                                    return (<Tag color="warning">负责人不同，无法操作</Tag>)
                                }

                            }
                        },
                    ];
                    pre.push((
                        <Panel header={item.name} extra={extra} key={item.id} className="site-collapse-custom-panel">
                            <Descriptions>
                                <Descriptions.Item label="茶名">{item.name}</Descriptions.Item>
                                <Descriptions.Item label="类型">{this.getDictValue("type", item.typeId.slice(0, 4) + "00") + "-" + this.getDictValue("type", item.typeId)}</Descriptions.Item>
                                <Descriptions.Item label="批次">{item.batch}</Descriptions.Item>
                                <Descriptions.Item label="产地">{item.plant.place}</Descriptions.Item>
                                <Descriptions.Item label="检测次数">{item.check ? item.check.length : 0}</Descriptions.Item>
                            </Descriptions>
                            <Table
                                className="components-table-demo-nested"
                                title={(c) =>
                                    <Row justify="space-between" >
                                        <span>检测记录</span>
                                        <Button onClick={() => { this.setState({ editVisible: true, tea: item, index: -1 }) }} type="primary">新增</Button>
                                    </Row>}
                                columns={columns}
                                rowKey="date"
                                dataSource={item.check}
                            />
                        </Panel>
                    ))
                    return pre
                }, [])
            }
        }
    }
    handleDelete = async (item, index) => {
        item.check.splice(index, 1)
        const res = await reqUpdateCheck(item)
        if (res.data.data.id) {
            message.success("删除成功！")
            this.getCheck(1, 3, false)
            this.setState({ tea: item })
        }
    }
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ imgFileList: fileList });
    onRemove = (file) => {
        this.setState(state => {
            const index = state.imgFileList.indexOf(file);
            const newFileList = state.imgFileList.slice();
            newFileList.splice(index, 1);
            const f = state.imgFile.find(item => item.uid === file.uid)
            const i = state.imgFile.indexOf(f);
            const imgFile = state.imgFile.slice();
            imgFile.splice(i, 1);
            return {
                imgFileList: newFileList,
                imgFile
            };
        });
    }
    beforeUpload = file => {
        const imgFile = this.state.imgFile;
        imgFile.push(file);
        this.setState({ imgFile: imgFile })
        this.setState(state => ({
            imgFileList: [...state.imgFileList, file],
        }));
        return false;
    }
    ipfsUpload = async (fileList) => {
        let hash = []
        if (Array.isArray(fileList)) {
            for (let i = 0; i < fileList.length; i++) {
                let reader = new FileReader()
                reader.readAsArrayBuffer(fileList[i])
                let promise = new Promise(resolve => {
                    reader.onloadend = (e) => {
                        // 上传数据到IPFS
                        addImg(reader).then((h) => {
                            resolve(h)
                        });
                    }
                })
                hash[i] = await promise;
                //console.log(hash[i])
            }
            return hash
        } else {
            let reader = new FileReader();
            reader.readAsArrayBuffer(fileList)
            reader.onloadend = async (e) => {
                // 上传数据到IPFS
                hash[hash.length - 1] = await addImg(reader);
            }
            return hash
        }

    }
    handleImgOk = async () => {
        const { tea, imgFile, imgFileList, index } = this.state
        let edit = false
        let imgList = []
        imgFileList.forEach(item => {
            if (item.name === tea.check[index].info) {
                imgList.push(item.name)
            } else {
                edit = true
            }
        });
        if (imgFileList.length === 0 || edit) {
            const img = await this.ipfsUpload(imgFile)
            if (img) {
                imgList = imgList.concat(img)
                tea.check[index].info = imgList[0]
                const res = await reqUpdateCheck(tea)
                if (res.data.data.id) {
                    message.success("修改成功")
                }
            }
        }
        this.setState({ visible: false, editImg: false, tea })
    }
    imgView = (tea, index) => {
        if (Array.isArray(tea.check)) {
        } else {
            tea.check = []
        }
        const img = tea.check[index].info
        let imgFileList = []
        if (img) {
            let file = {}
            file.uid = index
            file.name = img
            file.status = 'done'
            file.url = global.ipfs.uri + img
            imgFileList.push(file)
        }
        this.setState({ visible: true, index, imgFileList, img, tea, imgFile: [] })
    }
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
    getDictValue = (name, id) => {
        const { dict } = this.props
        if (dict[name] && Array.isArray(dict[name])) {
            const result = dict[name].find(item => item.valueId === id)
            if (result) {
                return result.valueName
            } else {
                return id
            }
        }
    }
    ufCheckCurrentChange = page => {
        const user = memoryUtils.user
        this.getPlant(page, 3, user.id, false)
    }

    render() {
        const { ufCheck, visible, img, editImg, imgFileList, editVisible, tea, index } = this.state
        const ufText = ufCheck.total ? "您有" + ufCheck.total + "条待办" : "暂无信息"
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        return (
            <div>
                <Alert message={ufText} type="info" />
                <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                    className="site-collapse-custom-collapse"
                >
                    {this.getUFProcess()}
                </Collapse>
                <Pagination hideOnSinglePage style={{ marginTop: "10px", textAlign: "right" }} pageSize={3} current={ufCheck.page} onChange={this.ufCheckCurrentChange} total={ufCheck.total} />
                <Modal
                    title="详情图"
                    visible={visible}
                    onCancel={() => this.setState({ visible: false, editImg: false })}
                    footer={[
                        <Button key="back" onClick={() => this.setState({ visible: false, editImg: false })}>
                            取消
                        </Button>,
                        <Button key="edit" type="dashed" onClick={() => this.setState({ editImg: true })}>
                            编辑
                         </Button>,
                        <Button key="submit" type="primary" onClick={this.handleImgOk}>
                            确认
                        </Button>,
                    ]}
                    bodyStyle={{ backgroundColor: "white" }}
                >   <Carousel style={{ backgroundColor: "white" }} autoplay>
                        {this.getCarousel(img)}
                    </Carousel>
                    {editImg ? (<Upload
                        onRemove={this.onRemove}
                        beforeUpload={this.beforeUpload}
                        listType="picture-card"
                        fileList={imgFileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                    >
                        {imgFileList.length >= 1 ? null : uploadButton}
                    </Upload>) : ("")}

                </Modal>
                <Modal bodyStyle={{ backgroundColor: "white" }} visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>

                <Modal
                    title="加工阶段"
                    visible={editVisible}
                    bodyStyle={{ backgroundColor: "white" }}
                    footer={null}
                    onCancel={() => this.setState({ editVisible: false })}
                >
                    <EditCheck tea={tea} index={index} dict={this.props.dict} hideModal={() => {
                        this.setState({ editVisible: false })
                        this.getCheck(1, 3, false)
                    }}></EditCheck>
                </Modal>
            </div>
        )
    }
}