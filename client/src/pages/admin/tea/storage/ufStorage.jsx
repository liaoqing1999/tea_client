import React from "react";
import moment from 'moment';
import { Descriptions, Button, Collapse, Pagination, Row, Upload, Alert, Popconfirm, Modal, Carousel, message } from 'antd'
import { reqGetStorage, reqUpdateStorage } from "../../../../api";
import memoryUtils from "../../../../utils/memoryUtils";
import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons';
import { addImg } from "../../../../api/ipfs";
import getWeb3 from '../../../../getWeb3';
import Tea from "../../../../contracts/Tea.json";
import EditStorage from "./editStorage";
const { Panel } = Collapse;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export default class UFStorage extends React.Component {
    state = {
        ufStorage: {},
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
        this.getStorage(1, 3, false)
        this.getWeb3Tea()
    }
    componentWillReceiveProps(nextProps) {
        this.getStorage(1, 3, false)
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
    finishProcess = async (tea) => {
        const { contract, web3 } = this.state
        if (contract && web3) {
            tea.storage = tea.storage ? tea.storage : {}
            tea.storage.finish = true
            tea.storage.endDate = tea.storage.endDate ? tea.storage.endDate : new Date()
            const res = await reqUpdateStorage(tea)
            if (res.data.data.id) {
                const { contract } = this.state
                const tea = res.data.data
                const storage = tea.storage;
                await contract.methods.setStorage(tea.id, storage.place, new Date(storage.startDate).valueOf(), new Date(storage.endDate).valueOf(), storage.storageer, storage.img, storage.finish).send({ from: this.state.accounts[0] });
                this.props.addRefresh()
                message.success("任务完成！")
            }
        } else {
            this.getWeb3Tea()
        }
    }
    getStorage = async (page, rows, finish) => {
        const user = memoryUtils.user
        const res = await reqGetStorage(page, rows, user.id, finish)
        const ufStorage = res.data.data
        this.setState({ ufStorage })
    }
    getUFProcess = () => {
        const { ufStorage } = this.state
        if (ufStorage) {
            if (Array.isArray(ufStorage.content)) {
                return ufStorage.content.reduce((pre, item) => {
                    const extra = (
                        <div>
                            <span style={{ marginRight: "10px" }}>批次:{item.batch}</span>
                            <Popconfirm title="确定完成此任务吗?" onConfirm={() => {
                                this.finishProcess(item)
                            }}>
                                <Button type="primary">完成</Button>
                            </Popconfirm>
                        </div>
                    )
                    const title = (
                        <Row justify="space-between">
                            <span>仓储记录</span>
                            <Button type="primary" onClick={() => this.setState({ editVisible: true, tea: item })}>编辑</Button>
                        </Row>
                    )
                    item.storage = item.storage ? item.storage : {}
                    const storage = item.storage
                    pre.push((
                        <Panel header={item.name} extra={extra} key={item.id} className="site-collapse-custom-panel">
                            <Descriptions >
                                <Descriptions.Item label="茶名">{item.name}</Descriptions.Item>
                                <Descriptions.Item label="类型">{this.getDictValue("type", item.typeId.slice(0, 4) + "00") + "-" + this.getDictValue("type", item.typeId)}</Descriptions.Item>
                                <Descriptions.Item label="批次">{item.batch}</Descriptions.Item>
                                <Descriptions.Item label="产地">{item.plant.place}</Descriptions.Item>
                                <Descriptions.Item label="产品等级">{this.getDictValue("grade", item.grade)}</Descriptions.Item>
                            </Descriptions>
                            <Descriptions title={title}>
                                <Descriptions.Item label="仓储地点">{storage.place}</Descriptions.Item>
                                <Descriptions.Item label="开始时间">{storage.startDate ? moment(storage.startDate).format("lll") : ""}</Descriptions.Item>
                                <Descriptions.Item label="结束时间">{storage.endDate ? moment(storage.endDate).format("lll") : ""}</Descriptions.Item>
                                <Descriptions.Item label="是否完成">{storage.finish ? "是" : "否"}</Descriptions.Item>
                                <Descriptions.Item label="阶段图"><Button type="link" onClick={() => this.imgView(item)}>查看详情</Button></Descriptions.Item>
                            </Descriptions>
                        </Panel>
                    ))
                    return pre
                }, [])
            }
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
        const { tea, imgFile, imgFileList } = this.state
        let edit = false
        let imgList = []
        imgFileList.forEach(item => {
            const res = tea.storage.img.find(i => i === item.name)
            if (!res) {
                edit = true
            } else {
                imgList.push(item.name)
            }
        });
        if (imgFileList.length !== tea.storage.img.length || edit) {
            const img = await this.ipfsUpload(imgFile)
            if (img) {
                imgList = imgList.concat(img)
                tea.storage.img = imgList
                const res = await reqUpdateStorage(tea)
                if (res.data.data.id) {
                    message.success("修改成功")
                }
            }
        }
        this.setState({ visible: false, editImg: false, tea })
    }
    imgView = (tea) => {
        tea.storage = tea.storage ? tea.storage : {}
        tea.storage.img = tea.storage.img ? tea.storage.img : []
        const img = tea.storage.img
        let imgFileList = []
        img.forEach((item, index) => {
            let file = {}
            file.uid = index
            file.name = img[index]
            file.status = 'done'
            file.url = global.ipfs.uri + img[index]
            imgFileList.push(file)
        });
        this.setState({ visible: true, imgFileList, img, tea, imgFile: [] })
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
    ufStorageCurrentChange = page => {
        const user = memoryUtils.user
        this.getPlant(page, 3, user.id, false)
    }

    render() {
        const { ufStorage, visible, img, editImg, imgFileList, editVisible, tea, index } = this.state
        const ufText = ufStorage.total ? "您有" + ufStorage.total + "条待办" : "暂无信息"
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
                <Pagination hideOnSinglePage style={{ marginTop: "10px", textAlign: "right" }} pageSize={3} current={ufStorage.page} onChange={this.ufStorageCurrentChange} total={ufStorage.total} />
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
                        {imgFileList.length >= 3 ? null : uploadButton}
                    </Upload>) : ("")}

                </Modal>
                <Modal bodyStyle={{ backgroundColor: "white" }} visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>

                <Modal
                    title="仓储阶段"
                    visible={editVisible}
                    bodyStyle={{ backgroundColor: "white" }}
                    footer={null}
                    onCancel={() => this.setState({ editVisible: false })}
                >
                    <EditStorage tea={tea} index={index} dict={this.props.dict} hideModal={() => {
                        this.setState({ editVisible: false })
                        this.getStorage(1, 3, false)
                    }}></EditStorage>
                </Modal>
            </div>
        )
    }
}