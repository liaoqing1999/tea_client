import React, { Component } from 'react'
import { Modal, Card, Button, Table, Popconfirm, Descriptions, message, Row, Divider, Select, Col, Carousel, Form } from 'antd'
import { reqDictType, reqProducePage, reqProducDelete } from '../../../../api'
import TeaType from '../../../../components/teaType';
import { GetOrgSelect } from '../staff/orgRoleSelect';
const { Option } = Select;
export default class Produce extends Component {
    state = {
        produceList: {},
        produce: {},
        selectedRowKeys: [],
        dict: {},
        cond: {}
    }
    form = React.createRef();
    componentDidMount() {
        this.getDate(1, 10)
        this.getDict(["state", "type", "grade"])
    }
    expandedRowRender = (record) => {
        return (
            <Descriptions column={2} >
                <Descriptions.Item label="规格">{record.specs}</Descriptions.Item>
                <Descriptions.Item label="图片"> <Button style={{ padding: "0" }} type="link" onClick={() => this.setState({ visible: true, img: record.img })}>查看详情</Button></Descriptions.Item>
                <Descriptions.Item label="食用方法" span={2}> {record.eat}</Descriptions.Item>
                <Descriptions.Item label="描述" span={2}>{record.desc}</Descriptions.Item>
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
        } else {
            return <div><img alt="img" src={global.ipfs.uri + img}></img> </div>
        }
    }
    getDate = async (page, rows, cond) => {
        const res = await reqProducePage(page, rows, cond)
        if (res.data.data) {
            const produceList = res.data.data
            cond = cond ? cond : {}
            this.setState({ produceList, produce: {}, selectedRowKeys: [], cond })
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
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, produce: selectedRows[0] });
    };
    getOption = (name) => {
        const { dict } = this.state
        if (Array.isArray(dict[name])) {
            return dict[name].reduce((pre, item) => {
                pre.push((
                    <Option key={item.id} value={item.valueId}>{item.valueName}</Option>
                ))
                return pre
            }, [])
        }
    }
    ViewNewsDetail = () => {
        const { produce } = this.state
        this.props.history.push("/admin/produceMag/detail", { produce: produce })
    }
    addEdit = (produce, type) => {
        const { dict } = this.state
        this.props.history.push("/admin/produceMag/edit", { produce: produce, type, dict, editType: 'sys' })
    }
    handleDelete = async (record) => {
        await reqProducDelete(record.id)
        message.success("删除成功")
        this.getDate(this.state.produceList.page, this.state.produceList.rows, this.state.cond)
    }
    render() {
        const { produceList, visible, selectedRowKeys, img, cond } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: "radio"
        };
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: () => `共${produceList.total}条`,
            total: produceList.total,
            onShowSizeChange: (current, pageSize) => this.getDate(current, pageSize, cond),
            onChange: (current) => this.getDate(current, produceList.rows, cond),
        };
        const columns = [
            {
                title: '产品名',
                dataIndex: 'name',
            },
            {
                title: '类型',
                dataIndex: 'type_id',
                render: (text) => this.getDictValue("type", text.slice(0, 4) + "00") + "-" + this.getDictValue("type", text)
            },
            {
                title: '等级',
                dataIndex: 'grade',
                render: (text) => this.getDictValue("grade", text)
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (text) => <span>{text}￥</span>
            },
            {
                title: '存量',
                dataIndex: 'reserve'
            },
            {
                title: '机构',
                dataIndex: 'orgName'
            },
            {
                title: '状态',
                dataIndex: 'state',
                render: (text) => this.getDictValue("state", text)
            },
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
        ]
        const title = (
            <div>
                <Form ref={this.form} onFinish={(values) => this.getDate(this.state.produceList.page, this.state.produceList.rows, values)}>
                    <Row justify="space-between">
                        <Col span={4}>
                            <Form.Item name='state' label="状态">
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: "100%" }}
                                    placeholder="请选择状态"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {this.getOption('state')}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='typeId' label="类型">
                                <TeaType></TeaType>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='org' label="机构">
                                <GetOrgSelect></GetOrgSelect>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='grade' label="等级">
                                <Select
                                    showSearch
                                    allowClear
                                    style={{ width: "100%" }}
                                    placeholder="请选择状态"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {this.getOption('grade')}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Form.Item >
                            <Button style={{ marginRight: "10px" }} type="primary" htmlType="submit">查询 </Button>
                            <Button onClick={() => {
                                this.getDate(this.state.produceList.page, this.state.produceList.rows, {})
                                this.form.current.resetFields()
                            }}>重置查询</Button>
                        </Form.Item>
                    </Row>
                </Form>
                <Button type="primary" onClick={() => this.addEdit({}, 'add')} style={{ marginRight: "20px" }}>新增产品</Button>
                <Button type="primary" onClick={this.ViewNewsDetail} disabled={!selectedRowKeys.length}>产品茶叶详情</Button>
            </div>
        )
        return (
            <div className="role">
                <Card title={title}>
                    <Table
                        bordered
                        className="components-table-demo-nested"
                        columns={columns}
                        rowKey="id"
                        rowSelection={rowSelection}
                        expandable={{ expandedRowRender: this.expandedRowRender }}
                        pagination={paginationProps}
                        dataSource={produceList.content}
                    />
                </Card>
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