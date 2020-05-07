import React, { Component } from 'react'
import memoryUtils from '../../../../utils/memoryUtils'
import { PlusOutlined } from '@ant-design/icons';
import {
    List, Alert, Collapse, Popconfirm, Button, Modal, Carousel, Descriptions,
    Tabs,Row, message, Upload, Pagination
} from 'antd'
import { CaretRightOutlined } from '@ant-design/icons';
import { reqGetPlant, reqDictType, reqUpdatePlant, reqOrg, reqAddTea } from '../../../../api';
import { formateDate } from '../../../../utils/dateUtils';
import EditPesticide from './editPesticide';
import { addImg } from '../../../../api/ipfs';
import getWeb3 from '../../../../getWeb3';
import Tea from "../../../../contracts/Tea.json";
import AddTea from './addTea';
import FPlant from './fPlant';
const { Panel } = Collapse;
const { TabPane } = Tabs;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export default class Plant extends Component {
    state = {
        ufPlant: {},
        org: {},
        dict: {},
        img: [],
        visible: false,
        pesticideVisible: false,
        tea: null,
        editImg: false,
        imgFileList: [],
        imgFile: [],
        web3: null, 
        accounts: null, 
        contract: null,
        addTeaVisible:false,
    }
    ufPlantCurrentChange = page => {
        const user = memoryUtils.user
        this.getPlant(page, 3, user.id, false)
    }
    getPlant = async (page, rows, userId, finish) => {
        const res = await reqGetPlant(page, rows, userId, finish)
        const ufPlant = res.data.data
        this.setState({ ufPlant })
    }
    getWeb3Tea =async () =>{
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
    finishPlant = async (tea) => {
        tea.plant.finish = true
        const res = await reqUpdatePlant(tea)
        if (res.data.data.id) {
            const {contract} = this.state
            message.success("任务完成！")
            const user = memoryUtils.user
            const tea = res.data.data
            const plant =tea.plant;
            const pesticide = plant.pesticide;
            this.getPlant(1, 3, user.id, false)
            if(plant.place){
                await contract.methods.setPlant(tea.id,plant.place,plant.planter,plant.img,plant.finish).send({ from: this.state.accounts[0] });
            }
            if(Array.isArray(pesticide)&&pesticide.length>0){
                for(let i = 0;i<pesticide.length;i++){
                    await this.state.contract.methods.setPesticide(tea.id,pesticide[i].name,new Date(pesticide[i].date).valueOf()).send({ from: this.state.accounts[0] });
                }
            }
        }
    }
    addTea =async (tea) =>{
        tea.plant.planter = memoryUtils.user.id
        tea.plant.pesticide =[]
        const res = await reqAddTea(tea)
        if(res.data.data){
            tea = res.data.data
            const {contract} = this.state
            const user = memoryUtils.user
            await contract.methods.setProduct(tea.id,tea.name,tea.typeId,tea.batch,tea.produce).send({ from: this.state.accounts[0] });
            this.getPlant(1, 3, user.id, false)
            message.success("添加茶叶成功！")
        }
    }
    getOrg = async () => {
        const user = memoryUtils.user
        if (user.org) {
            const res = await reqOrg(user.org)
            if (res.data.data.id) {
                const org = res.data.data
                this.setState({ org })
            }
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
    handleDelete = async (item, index) => {
        item.plant.pesticide.splice(index, 1)
        const res = await reqUpdatePlant(item)
        if (res.data.data.id) {
            message.success("删除成功！")
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
            const f = state.imgFile.find(item =>item.uid === file.uid)
            const i= state.imgFile.indexOf(f);
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
            const res = tea.plant.img.find(i => i === item.name)
            if (!res) {
                edit = true
            } else {
                imgList.push(item.name)
            }
        });
        if (imgFileList.length !== tea.plant.img.length || edit) {
            const img = await this.ipfsUpload(imgFile)
            if (img) {
                imgList = imgList.concat(img)
                tea.plant.img = imgList
                const res = await reqUpdatePlant(tea)
                if (res.data.data.id) {
                    message.success("修改成功")
                }
            }
        }
        this.setState({ visible: false, editImg: false, tea })
    }
    imgView = (tea) => {
        const img = tea.plant.img
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
    componentDidMount = () => {
        const user = memoryUtils.user
        this.getPlant(1, 3, user.id, false)
        let typeCodes = ["type", "pesticide"]
        this.getDict(typeCodes)
        this.getOrg()
        this.getWeb3Tea()
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
        } else {
            return <img alt="img" src={global.ipfs.uri + img}></img>
        }
    }
    getufPlant = () => {
        const { ufPlant } = this.state
        if (ufPlant) {
            if (Array.isArray(ufPlant.content)) {
                return ufPlant.content.reduce((pre, item) => {
                    const extra = (
                        <div>
                            <span style={{ marginRight: "10px" }}>批次:{item.batch}</span>
                            <Popconfirm title="确定完成此任务吗?" onConfirm={() => {
                                this.finishPlant(item)
                            }}>
                                <Button type="primary">完成</Button>
                            </Popconfirm>
                        </div>
                    )
                    pre.push((
                        <Panel header={item.name} extra={extra} key={item.id} className="site-collapse-custom-panel">
                            <Descriptions size="small">
                                <Descriptions.Item label="茶名">{item.name}</Descriptions.Item>
                                <Descriptions.Item label="类型">{this.getDictValue("type", item.typeId.slice(0, 4) + "00") + "-" + this.getDictValue("type", item.typeId)}</Descriptions.Item>
                                <Descriptions.Item label="批次">{item.batch}</Descriptions.Item>
                                <Descriptions.Item label="产地">{item.plant.place}</Descriptions.Item>
                                <Descriptions.Item label="施药次数">{item.plant.pesticide?item.plant.pesticide.length:0}</Descriptions.Item>
                                <Descriptions.Item label="阶段图">
                                    <Button type="link" onClick={() => { this.imgView(item) }}>查看详情</Button>
                                </Descriptions.Item>
                            </Descriptions>
                            <List
                                header={<Row justify="space-between">施药记录  <Button type="link" onClick={() => {
                                    item.index = -1
                                    this.setState({ pesticideVisible: true, tea: item })
                                }}>新增</Button></Row>}
                                bordered
                                dataSource={item.plant.pesticide?item.plant.pesticide:[]}
                                renderItem={(i, index) => (
                                    <List.Item actions={[<Button type="link" onClick={() => {
                                        item.index = index
                                        this.setState({ pesticideVisible: true, tea: item })
                                    }}>编辑</Button>,
                                    <Popconfirm title="确定要删除吗?" onConfirm={() => {
                                        this.handleDelete(item, index)
                                    }}>
                                        <Button type="danger">删除</Button>
                                    </Popconfirm>]}>
                                        <span>农药名:{this.getDictValue("pesticide", i.name)} </span>
                                        <span>施药时间:{formateDate(i.date)} </span>
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    ))
                    return pre
                }, [])
            }
        }
    }
    render() {
        const user = memoryUtils.user
        const { imgFileList, ufPlant, editImg,org, addTeaVisible,
            pesticideVisible, visible, img, dict, tea } = this.state
        const operations = org.staffProduce?(<Button type="primary" onClick={() =>this.setState({addTeaVisible:true})}>新增待办</Button>):("")
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const ufText = ufPlant.total ? "您有" + ufPlant.total + "条待办" : "暂无信息"
        return (
            <div>
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
                    title="施药记录"
                    visible={pesticideVisible}
                    bodyStyle={{ backgroundColor: "white" }}
                    footer={null}
                    onCancel={() => this.setState({ pesticideVisible: false })}
                >
                    <EditPesticide tea={tea} dict={dict} hideModal={() => this.setState({ pesticideVisible: false })}></EditPesticide>
                </Modal>
                <Modal
                    title="新增茶叶"
                    visible={addTeaVisible}
                    bodyStyle={{ backgroundColor: "white" }}
                    footer={null}
                    onCancel={() => this.setState({ addTeaVisible: false })}
                >  
                   <AddTea  addTea={this.addTea} hideModal={() => this.setState({ addTeaVisible: false })}></AddTea>
                </Modal>
                {user.org ? (
                    <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
                        <TabPane tab="待办" key="1">
                            <Alert message={ufText} type="info" />
                            <Collapse
                                bordered={false}
                                defaultActiveKey={['1']}
                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                className="site-collapse-custom-collapse"
                            >
                                {this.getufPlant()}
                            </Collapse>
                            <Pagination hideOnSinglePage style={{ marginTop: "10px", textAlign: "right" }} pageSize={3} current={ufPlant.page} onChange={this.ufPlantCurrentChange} total={ufPlant.total} />
                        </TabPane>
                        <TabPane tab="已完成" key="2">
                            <FPlant dict={dict}></FPlant>
                        </TabPane>
                    </Tabs>
                ) :
                    (<Alert
                        message="警告"
                        description="您不属于任何机构！."
                        type="warning"
                        showIcon
                    />)}
            </div>
        )
    }
}