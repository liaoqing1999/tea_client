import React, { Component } from 'react'
import memoryUtils from '../../../utils/memoryUtils'
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
    List, Alert, Collapse, Popconfirm, Button, Modal, Carousel, Descriptions,
    Tabs, Table, Badge, Menu, Dropdown, Row, message, Upload
} from 'antd'
import { CaretRightOutlined } from '@ant-design/icons';
import { reqGetPlant, reqDictType, reqUpdatePlant } from '../../../api';
import { formateDate } from '../../../utils/dateUtils';
import EditPesticide from './editPesticide';
import { addImg } from '../../../api/ipfs';
const { Panel } = Collapse;
const { TabPane } = Tabs;
const menu = (
    <Menu>
        <Menu.Item>Action 1</Menu.Item>
        <Menu.Item>Action 2</Menu.Item>
    </Menu>
);
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
const expandedRowRender = () => {
    const columns = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Status',
            key: 'state',
            render: () => (
                <span>
                    <Badge status="success" />
            Finished
                </span>
            ),
        },
        { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
        {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            render: () => (
                <span className="table-operation">
                    <a>Pause</a>
                    <a>Stop</a>
                    <Dropdown overlay={menu}>
                        <a>
                            More <DownOutlined />
                        </a>
                    </Dropdown>
                </span>
            ),
        },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
        data.push({
            key: i,
            date: '2014-12-24 23:12:00',
            name: 'This is production name',
            upgradeNum: 'Upgraded: 56',
        });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
};

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Platform', dataIndex: 'platform', key: 'platform' },
    { title: 'Version', dataIndex: 'version', key: 'version' },
    { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    { title: 'Creator', dataIndex: 'creator', key: 'creator' },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Action', key: 'operation', render: () => <a>Publish</a> },
];

const data = [];
for (let i = 0; i < 3; ++i) {
    data.push({
        key: i,
        name: 'Screem',
        platform: 'iOS',
        version: '10.3.4.5654',
        upgradeNum: 500,
        creator: 'Jack',
        createdAt: '2014-12-24 23:12:00',
    });
}
export default class Plant extends Component {
    state = {
        fPlant: null,
        ufPlant: null,
        dict: {},
        img: [],
        visible: false,
        pesticideVisible: false,
        tea: null,
        editImg: false,
        imgFileList: [],
        imgFile: []
    }
    onChange = (key) => {

    }
    getPlant = async (page, rows, userId, finish) => {
        const res = await reqGetPlant(page, rows, userId, finish)
        const ufPlant = res.data.data
        this.setState({ ufPlant })
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
            return {
                imgFileList: newFileList,
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
        let imgList =[]
        imgFileList.forEach(item => {
            const res = tea.plant.img.find(i => i === item.name)
            if(!res){
                edit = true 
            }else{
                imgList.push(item.name)
            }
        });
        if (imgFileList.length!==tea.plant.img.length||edit) {
            const img = await this.ipfsUpload(imgFile)
            if (img) {
                imgList = imgList.concat(img)
                tea.plant.img =imgList
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
        this.setState({ visible: true, imgFileList, img, tea,imgFile:[] })
    }
    componentDidMount = () => {
        const user = memoryUtils.user
        this.getPlant(1, 3, user.id, false)
        let typeCodes = ["type", "place_origin", "pesticide"]
        this.getDict(typeCodes)
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
                    pre.push((
                        <Panel header={item.name} extra={"批次：" + item.batch} key={item.id} className="site-collapse-custom-panel">
                            <Descriptions size="small">
                                <Descriptions.Item label="茶名">{item.name}</Descriptions.Item>
                                <Descriptions.Item label="类型">{this.getDictValue("type", item.typeId.slice(0, 4) + "00") + "-" + this.getDictValue("type", item.typeId)}</Descriptions.Item>
                                <Descriptions.Item label="批次">{item.batch}</Descriptions.Item>
                                <Descriptions.Item label="产地">{this.getDictValue("place_origin", item.plant.place)}</Descriptions.Item>
                                <Descriptions.Item label="施药次数">{item.plant.pesticide.length}</Descriptions.Item>
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
                                dataSource={item.plant.pesticide}
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
        const { imgFileList, ufPlant, fPlant, editImg, pesticideVisible, visible, img, dict, tea } = this.state
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const ufText = ufPlant ? "您有" + ufPlant.total + "条待办" : "暂无信息"
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
                {user.org ? (
                    <Tabs defaultActiveKey="1" onChange={this.onChange}>
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
                        </TabPane>
                        <TabPane tab="已完成" key="2">
                            <Table
                                className="components-table-demo-nested"
                                columns={columns}
                                expandable={{ expandedRowRender }}
                                dataSource={data}
                            />
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