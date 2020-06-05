import React from "react";
import { Table, Form, Descriptions, Button, Carousel, Modal, Row, Popconfirm, Divider, message, Col, Select } from 'antd'
import { reqOrgPage, reqDictType,reqOrgUpdate,reqOrgAdd, reqOrgDelete} from "../../../../api";
import province from "../../../../components/place/province";
import EditOrg from "./edit";
const { Option } = Select;
export default class AuthOrg extends React.Component {
    state = {
        org: {},
        img: [],
        visible: false,
        cond: {},
        dict: {},
        o:{}
    }
    form = React.createRef();
    getOrg = async (page, rows, place,state) => {
        const res = await reqOrgPage(page, rows, place, state)
        const org = res.data.data
        let cond = {place:place,state:state}
        this.setState({ org ,cond})
    }
    expandedRowRender = (record) => {
        return (
            <Descriptions column={2} >
                <Descriptions.Item span={2} label="描述">{record.description}</Descriptions.Item>
                <Descriptions.Item label="备注">{record.remark}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{record.email}</Descriptions.Item>
                <Descriptions.Item label="机构生产许可证编号">{record.license}</Descriptions.Item>
                <Descriptions.Item label="机构图标"> <Button style={{ padding: "0" }} type="link" onClick={() => this.setState({ visible: true, img: record.trademark })}>查看详情</Button></Descriptions.Item>
                <Descriptions.Item label="营业执照"> <Button style={{ padding: "0" }} type="link" onClick={() => this.setState({ visible: true, img: record.permit })}>查看详情</Button></Descriptions.Item>
                <Descriptions.Item label="组织机构代码证"> <Button style={{ padding: "0" }} type="link" onClick={() => this.setState({ visible: true, img: record.codePermit })}>查看详情</Button></Descriptions.Item>
            </Descriptions>
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
        }  else if (img) {
            return <div><img alt="img" src={global.ipfs.uri + img}></img> </div>
        } else {
            return <div>暂无图片</div>
        }
    }
    getStateOption = () => {
        const { dict } = this.state
        if (dict["state"] && Array.isArray(dict["state"])) {
            return dict["state"].reduce((pre, item) => {
                pre.push((
                    <Option key={item.id} value={item.valueId}>{item.valueName}</Option>
                ))
                return pre
            }, [])
        }
    }
    getPlaceOption = () => {
        return province.reduce((pre, item) => {
            pre.push((
                <Option key={item.id} value={item.name}>{item.name}</Option>
            ))
            return pre
        }, [])
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
    getDict = async (typeCodes) => {
        const res = await reqDictType(typeCodes)
        if (res.data.data) {
            const dict = res.data.data
            this.setState({ dict })
        }
    }
    onFinish = async (values) => {
        const { type, o ,cond,org} = this.state
        if (Array.isArray(values.place)) {
            values.place= values.place.join("-");
        }
        if (type === 'add') {
            const res = await reqOrgAdd(values)
            if (res.data.data) {
                this.getOrg(org.page, org.rows, cond.place,cond.state)
                this.setState({ editVisible: false })
                message.success("增加成功")
            }
        } else {
            values.id = o.id
            values.trademark = o.trademark
            values.permit = o.permit  
            values.codePermit = o.codePermit
            const res = await reqOrgUpdate(values)
            if (res.data.data) {
                this.getOrg(org.page, org.rows, cond.place,cond.state)
                this.setState({ editVisible: false })
                message.success("修改成功")
            }
        }

    }
    handleDelete =async (record) =>{
        const {cond,org} = this.state
        await reqOrgDelete(record.id)
        message.success("删除成功")
        this.getOrg(org.page, org.rows, cond.place,cond.state)
    }
    componentDidMount = () => {
        this.getOrg(1, 3,"","all")
        const typeCodes = ['state']
        this.getDict(typeCodes)
    }
    render() {
        const { org,o, visible, cond, img ,type,editVisible,dict} = this.state
        const columns = [
            { title: '机构名', dataIndex: 'name', key: 'name' },
            { title: '法人', dataIndex: 'corporation', key: 'corporation' },
            { title: '允许非管理员新建产品', dataIndex: 'staffProduce', key: 'staffProduce',render: (text) => text?"是":"否"},
            { title: '状态', dataIndex: 'state', key: 'state',render: (text) => this.getDictValue("state", text) },
            { title: '联系电话', dataIndex: 'phone', key: 'phone' },
            { title: '地点', dataIndex: 'place', key: 'place' },
            {
                title: '操作', dataIndex: 'operation', width: 180, key: 'operation', render: (text, record) =>
                    <Row>
                        <Button size="middle" type="primary"  onClick={() => this.setState({ editVisible: true, o: record, type: 'edit' })}>编辑</Button>
                        <Divider type="vertical"></Divider>
                        <Popconfirm title="确定要拒绝吗?"onConfirm={() => this.handleDelete(record)}>
                            <Button size="middle" type="danger">删除</Button>
                        </Popconfirm>
                    </Row>
            },
        ];
        const paginationProps = {
            showQuickJumper: true,
            showTotal: () => `共${org.total}条`,
            total: org.total,
            pageSize: 3,
            onChange: (current) => this.getOrg(current, 3,cond.place,cond.state),
        };

        return (
            <div>
                <div>
                    <Form ref={this.form} onFinish={(values) =>this.getOrg(1, 3,values.place,values.state)}>
                        <Row justify="space-between">
                            <Col span={8}>
                                <Form.Item name='state' label="状态">
                                    <Select
                                        showSearch
                                        allowClear
                                        style={{ width: "100%" }}
                                        placeholder="请选择机构状态"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {this.getStateOption()}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                            <Form.Item name='place' label="地点">
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: "100%" }}
                                    placeholder="请选择机构地点"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {this.getPlaceOption()}
                                </Select>
                            </Form.Item>
                            </Col>
                            <Form.Item >
                                <Button style={{marginRight:"10px"}} type="primary" htmlType="submit">查询 </Button>
                                <Button onClick={()=>{
                                    this.getOrg(1, 3,"","all")
                                    this.form.current.resetFields()
                                    }}>重置查询</Button>
                            </Form.Item>
                        </Row>
                    </Form>
                    <Button type="primary" onClick={() => this.setState({ editVisible: true, o: {}, type: 'add' })}>新增机构</Button>
                </div>
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    rowKey="id"
                    expandable={{ expandedRowRender: this.expandedRowRender }}
                    pagination={paginationProps}
                    dataSource={org.content}
                />
                <Modal
                    title={type === 'add' ? "新增机构" : "编辑机构"}
                    visible={editVisible}
                    footer={null}
                    bodyStyle={{ backgroundColor: "white" }}
                    onCancel={() => { this.setState({ editVisible: false }) }}
                >
                    <EditOrg dict={dict} type={type} onFinish={this.onFinish} org={o} hideModal={() => { this.setState({ editVisible: false }) }}></EditOrg>
                </Modal>
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