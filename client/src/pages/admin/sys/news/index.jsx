import React, { Component } from 'react'
import { Modal, Card, Button, Table, Popconfirm, Descriptions, message, Row, Divider, Input, Select, Col, Carousel, Form, DatePicker } from 'antd'
import { reqAddStaff, reqStaffPage, reqDictType, reqUpdateStaff, reqDeleteStaff, reqUpdatePassword, reqNewsPage, reqDeleteNews } from '../../../../api'
import EditStaff from './edit';
import { formateDate } from '../../../../utils/dateUtils';
const { Option } = Select;
export default class NewsManage extends Component {
    state = {
        newsList: {},
        org: "",
        news: {},
        selectedRowKeys: [],
        addVisible: false,
        editVisible: false,
        dict: [],
        cond: {}
    }
    form = React.createRef();
    componentDidMount() {
        this.getDate(1, 10)
        this.getDict(["state", "news_type"])
    }
    expandedRowRender = (record) => {
        const span = record.orgName ? 3 : 1
        return (
            <Descriptions column={3} >
                <Descriptions.Item label="阅读人数">{record.read}</Descriptions.Item>
                <Descriptions.Item label="点赞数">{record.up}</Descriptions.Item>
                <Descriptions.Item label="踩数">{record.down}</Descriptions.Item>
                <Descriptions.Item label="评分">{record.rate}</Descriptions.Item>
                <Descriptions.Item label="评分人数">{record.rateNum}</Descriptions.Item>
                <Descriptions.Item label="跳转链接">{record.href ? (<Button type="link" onClick={() => window.open(record.href)}>点击跳转</Button>) : ("无")}</Descriptions.Item>
                {record.orgName ? (<Descriptions.Item label="所属机构">{record.orgName}</Descriptions.Item>) : ("")}
                <Descriptions.Item label="头像" span={span}> <Button style={{ padding: "0" }} type="link" onClick={() => this.setState({ visible: true, img: record.avatar })}>查看详情</Button></Descriptions.Item>
                <Descriptions.Item label="封面" span={3}>  <Button style={{ padding: "0" }} type="link" onClick={() => this.setState({ visible: true, img: record.cover })}>查看详情</Button></Descriptions.Item>
                <Descriptions.Item label="描述" span={3}>{record.desc}</Descriptions.Item>
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
        const res = await reqNewsPage(page, rows, cond)
        if (res.data.data) {
            const newsList = res.data.data
            cond = cond ? cond : {}
            this.setState({ newsList, news: {}, selectedRowKeys: [], cond })
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
    paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: () => `共${this.state.newsList.total}条`,
        total: this.state.newsList.totals,
        onShowSizeChange: (current, pageSize) => this.getDate(current, pageSize, this.state.cond),
        onChange: (current) => this.getDate(current, this.state.newsList.rows, this.state.cond),
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
    addEdit = (record, type) => {
        const { dict } = this.state
        this.props.history.push("/admin/news/edit", { news: record, type, dict, editType: 'sys' })
    }
    handleDelete = async (record) => {
        await reqDeleteNews(record.id)
        message.success("删除成功")
        this.getDate(this.state.newsList.page, this.state.newsList.rows, this.state.cond)
    }
    render() {
        const columns = [
            {
                title: '标题',
                dataIndex: 'title',
            },
            {
                title: '类型',
                dataIndex: 'type',
                render: (text) => this.getDictValue("news_type", text)
            },
            {
                title: '作者',
                dataIndex: 'writer'
            },
            {
                title: '发布者',
                dataIndex: 'publisher'
            },
            {
                title: '发布时间',
                dataIndex: 'date',
                render: (text) => formateDate(text)
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
        const { newsList, editVisible, visible, img, news, selectedRowKeys, type, dict, cond } = this.state

        const title = (
            <div>
                <Form ref={this.form} onFinish={(values) => this.getDate(this.state.newsList.page, this.state.newsList.rows, values)}>
                    <Row justify="space-between">
                        <Col span={5}>
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
                        <Col span={5}>
                            <Form.Item name='type' label="类型">
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
                                    {this.getOption('news_type')}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='date' label="发布时间">
                                <DatePicker.RangePicker />
                            </Form.Item>
                        </Col>
                        <Form.Item >
                            <Button style={{ marginRight: "10px" }} type="primary" htmlType="submit">查询 </Button>
                            <Button onClick={() => {
                                this.getDate(this.state.newsList.page, this.state.newsList.rows, {})
                                this.form.current.resetFields()
                            }}>重置查询</Button>
                        </Form.Item>
                    </Row>
                </Form>
                <Button type="primary" onClick={() => this.addEdit({}, 'add')} style={{ marginRight: "20px" }}>新增资讯</Button>
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
                        expandable={{ expandedRowRender: this.expandedRowRender }}
                        pagination={this.paginationProps}
                        dataSource={newsList.content}
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