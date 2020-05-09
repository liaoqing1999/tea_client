import React, { Component } from 'react'
import { Modal, Card, Button, Table, Popconfirm, message, Row, Divider, Input, Select, Col, Tag } from 'antd'
import { reqAddStaff, reqStaffPage, reqDictType, reqUpdateStaff, reqDeleteStaff, reqUpdatePassword } from '../../../../api'
import EditStaff from './edit';
import { formateDate } from '../../../../utils/dateUtils';
import { GetOrgSelect, GetRoleSelect } from './orgRoleSelect';
const { Option } = Select;
export default class Staff extends Component {
    state = {
        staff: {},
        org: "",
        user: {},
        selectedRowKeys: [],
        addVisible: false,
        editVisible: false,
        dict: [],
        cond: {}
    }
    componentDidMount() {
        this.getDate(1, 10)
        let typeCode=['state','sex']
        this.getDict(typeCode)
    }
    //表行选中触发事件
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, user: selectedRows[0] });
    };
    getDate = async (page, rows, cond) => {
        const res = await reqStaffPage(page, rows, cond)
        if (res.data.data) {
            const staff = res.data.data
            cond = cond ? cond : {}
            this.setState({ staff, user: {}, selectedRowKeys: [], cond })
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
        showTotal: () => `共${this.state.staff.total}条`,
        total: this.state.staff.totals,
        onShowSizeChange: (current, pageSize) => this.getDate(current, pageSize, this.state.cond),
        onChange: (current) => this.getDate(current, this.state.staff.rows, this.state.cond),
    };
    onFinish = async (values) => {
        const { type, user } = this.state
        if (type === 'add') {
            values.createTime = new Date()
            const res = await reqAddStaff(values)
            if (res.data.data) {
                this.getDate(this.state.staff.page, this.state.staff.rows, this.state.cond)
                this.setState({ editVisible: false })
                message.success("增加成功")
            }
        } else {
            values.id = user.id
            values.password = user.password
            values.img = user.img
            values.createTime = user.createTime
            const res = await reqUpdateStaff(values)
            if (res.data.data) {
                this.getDate(this.state.staff.page, this.state.staff.rows, this.state.cond)
                this.setState({ editVisible: false })
                message.success("修改成功")
            }
        }

    }
    getOption = () => {
        const { dict } = this.state
        if (dict["state"]) {
            return dict["state"].reduce((pre, item) => {
                pre.push((
                    <Option key={item.id} value={item.valueId}>{item.valueName}</Option>
                ))
                return pre
            }, [])
        }

    }
    handleDelete = async (record) => {
        await reqDeleteStaff(record.id)
        message.success("删除成功")
        this.getDate(this.state.staff.page, this.state.staff.rows, this.state.cond)
    }
    resetPassword = async () => {
        const { user } = this.state
        await reqUpdatePassword(user.id, "123456")
        message.success("重置成功")
        this.getDate(this.state.staff.page, this.state.staff.rows, this.state.cond)
    }
    render() {
        const columns = [
            {
                title: '用户名',
                dataIndex: 'name',
            },
            {
                title: '真实姓名',
                dataIndex: 'realName'
            },
            {
                title: '手机号码',
                dataIndex: 'phone'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                render: (text) => formateDate(text)
            },
            {
                title: '状态',
                dataIndex: 'state',
                render: (text) => this.getDictValue("state", text)
            },
            {
                title: '机构',
                dataIndex: 'staffOrg',
                render: (text, record) => <span>{text.length ? text[0].name : ""}</span>
            },
            {
                title: '角色',
                dataIndex: 'staffRole',
                render: (text, record) => <span>{text.length ? text[0].name : ""}</span>
            },
            {
                title: '操作',
                dataIndex: 'staffRole',
                width: 180,
                render: (text, record) => {
                    if (text.length && text[0].name !== 'superAdmin') {
                        return( <Row>
                            <Button size="middle" onClick={() => this.setState({ editVisible: true, user: record, type: 'edit' })}>编辑</Button>
                            <Divider type="vertical"></Divider>
                            <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record)}>
                                <Button size="middle" type="danger">删除</Button>
                            </Popconfirm>
                        </Row>)
                    }else{
                        return (<Tag color="warning">超级管理员不允许操作</Tag>)
                    }
                }

            },
        ]
        const { staff, editVisible, user, selectedRowKeys, type, dict, cond } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: "radio"
        };
        const title = (
            <div>
                <Row justify="space-between" gutter={30} style={{ marginBottom: "10px" }}>
                    <Col span={4}><Input allowClear onChange={({ target: { value } }) => cond.name = value} defaultValue={cond.name} placeholder="请输入用户名"></Input></Col>
                    <Col span={4}> <GetOrgSelect style={{ width: "100%" }} onChange={(value) => cond.org = value} value={cond.org}></GetOrgSelect></Col>
                    <Col span={4}> <GetRoleSelect style={{ width: "100%" }} onChange={(value) => cond.role = value} value={cond.role}></GetRoleSelect></Col>
                    <Col span={4}>
                        <Select
                            showSearch
                            allowClear
                            style={{ width: "100%" }}
                            placeholder="请选择用户状态"
                            optionFilterProp="children"
                            defaultValue={cond.state}
                            onChange={(value) => cond.state = value}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {this.getOption()}
                        </Select>
                    </Col>
                    <Col span={5}>
                        <Button type="primary" onClick={() => this.getDate(this.state.staff.page, this.state.staff.rows, cond)} style={{ marginRight: "20px" }}>查询</Button>
                        <Button onClick={() => this.getDate(this.state.staff.page, this.state.staff.rows, {})}>重置查询</Button>
                    </Col>
                </Row>
                <Button type="primary" onClick={() => this.setState({ editVisible: true, user: {}, type: 'add' })} style={{ marginRight: "20px" }}>新增用户</Button>
                <Button type="primary" onClick={this.resetPassword} disabled={!selectedRowKeys.length}>重置密码</Button>
            </div>
        )
        return (
            <div className="role">
                <Card title={title}>
                    <Table
                        bordered
                        rowKey="id"
                        dataSource={staff.content}
                        columns={columns}
                        size="middle"
                        pagination={this.paginationProps}
                        rowSelection={rowSelection}
                    />
                </Card>
                <Modal
                    title={type === 'add' ? "新增用户" : "编辑用户"}
                    visible={editVisible}
                    footer={null}
                    bodyStyle={{ backgroundColor: "white" }}
                    onCancel={() => { this.setState({ editVisible: false }) }}
                >
                    <EditStaff dict={dict} type={type} onFinish={this.onFinish} user={user} hideModal={() => { this.setState({ editVisible: false }) }}></EditStaff>
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={this.state.editVisible1}
                    footer={null}
                    bodyStyle={{ backgroundColor: "white" }}
                    onCancel={this.hideEditModal}
                >

                </Modal>
            </div>
        )
    }
}