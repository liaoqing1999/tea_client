import React, { Component } from 'react'
import { Button, Table, Select, PageHeader, Modal, Carousel,Row,Col,Descriptions, Popconfirm, Divider, message } from 'antd'
import { reqPageTea, reqDictType ,reqDeleteTea} from '../../../../api'
import { FileImageTwoTone } from '@ant-design/icons';
import moment from 'moment';
const { Option } = Select;
export default class Tea extends Component {
    constructor(props) {
        super(props)
        const { state } = this.props.location
        if (state && state.produce) {
            let cond = {
                produce: state.produce.id
            }
            this.getDate(1, 10, cond)
            this.getDict(["type", "pesticide"])
        } else {
            this.props.history.goBack()
        }
    }
    state = {
        teaList: [],
        searchText: '',
        searchedColumn: '',
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
    addEdit = (produce, type) => {
        const { dict } = this.state
        this.props.history.push("/admin/produce/edit", { produce: produce, type, dict, editType: 'sys' })
    }
    handleDelete = async (record) => {
        await reqDeleteTea(record.id)
        message.success("删除成功")
        this.getDate(this.state.produceList.page, this.state.produceList.rows, this.state.cond)
    }
    expandedRowRender = (record) => {
        const columns = [
            { title: '农药名', dataIndex: 'name', key: 'name',render: (text) => this.getDictValue("pesticide", text)},
            { title: '施药时间', dataIndex: 'date', key: 'date', render: (text) => moment(text).format("lll") },
        ];
        const plant =  record.plant? record.plant:{}
        const data = plant.pesticide? plant.pesticide:[]
        return (
            <Row>
                <Col span={12}>
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="产地">{plant.place}</Descriptions.Item>
                        <Descriptions.Item label="施药次数">{data.length}</Descriptions.Item>
                        <Descriptions.Item label="阶段图"> <Button style={{padding:"0"}} type="link" onClick={() => this.setState({ visible: true, img: plant.img })}>查看详情</Button></Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={12}>
                    <Table  rowKey="date" columns={columns} dataSource={data} pagination={false} />
                </Col>
            </Row>
    
        );
    };
    getCarousel= (img) => {
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
            return <div><img alt="img" src={global.ipfs.uri + img}></img> </div>
        }
    }
    render() {
        const { teaList, visible, img,cond } = this.state
        const columns = [
            { title: '茶叶名', dataIndex: 'name', key: 'name' },
            { title: '批次', dataIndex: 'batch', key: 'batch' },
            { title: '保质期', dataIndex: 'period', key: 'period' },
            { title: '产品等级', dataIndex: 'grade', key: 'grade' },
            { title: '存储条件', dataIndex: 'store', key: 'store' },
            { title: '二维码', dataIndex: 'qr', key: 'qr', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}><FileImageTwoTone /></Button> },
            { title: '产品图', dataIndex: 'img', key: 'img', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}><FileImageTwoTone /></Button> },
            {
                title: '操作',
                dataIndex: 'staffRole',
                width: 180,
                render: (text, record) => {
                    return (<Row>
                        <Button size="middle" onClick={() => this.addEdit(record, 'edit')}>编辑</Button>
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
        const title = (
            <div>
                <Button type="primary" onClick={() => this.addEdit({}, 'add')} style={{ marginRight: "20px" }}>新增茶叶</Button>
            </div>
        )
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    onBack={() => this.props.history.goBack()}
                    title="产品茶叶"
                />
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    rowKey="id"
                    expandable={{ expandedRowRender: this.expandedRowRender }}
                    pagination={paginationProps}
                    dataSource={teaList.content}
                    expandable={{expandedRowRender:this.expandedRowRender}}
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
            </div>
        )
    }
}