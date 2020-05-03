import React, { Component } from 'react'
import { Form, Modal, Input, Card, Button, Table, Popconfirm, message, Row, Divider } from 'antd'
import { reqFindRoleByName, reqAddStaff, reqAddRole, reqStaffPage, reqDictType, reqUpdateStaff } from '../../../../api'
import EditStaff from './edit';
import { formateDate } from '../../../../utils/dateUtils';
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
const validfunc = async (rule, value) => {
    if (value) {
        const res = await reqFindRoleByName(value)
        if (res.data.data.length) {
            throw new Error('角色名已存在!');
        }
    } else {
        throw new Error('角色名是必须的!');
    }

}
let cond = {}
export default class Staff extends Component {
    state = {
        staff: {},
        org: "",
        user: {},
        selectedRowKeys: [],
        addVisible: false,
        editVisible: false,
        dict: [],
    }
    componentDidMount() {
        this.getDate(1, 10)
        this.getDict("state")
    }
    //表行选中触发事件
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, user: selectedRows[0] });
    };
    getDate = async (page, rows, user) => {
        const res = await reqStaffPage(page, rows, user)
        if (res.data.data) {
            const staff = res.data.data
            this.setState({ staff })
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
        onShowSizeChange: (current, pageSize) => this.changePageSize(pageSize, current),
        onChange: (current) => this.changePage(current),
    };
    changePage = (current) => {
        this.getDate(current, this.state.staff.rows, cond)
    }
    onFinish = async (values) => {
        const { type ,user} = this.state
        if (type === 'add') {
            values.createTime = new Date()
            const res = await reqAddStaff(values)
            if (res.data.data) {
                this.getDate(this.state.staff.page, this.state.staff.rows, cond)
                this.setState({ editVisible: false })
                message.success("增加成功")
            }
        } else {
            console.log(values,user,type)
            // const res = await reqUpdateStaff(values)
            // if (res.data.data) {
            //     this.getDate(this.state.staff.page, this.state.staff.rows, cond)
            //     this.setState({ editVisible: false })
            //     message.success("修改成功")
            // }
        }
      
    }
    handleDelete = async (record) => {
        console.log(record)
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
                render: (text, record) => <span>{Array.isArray(text) ? text[0].name : ""}</span>
            },
            {
                title: '角色',
                dataIndex: 'staffRole',
                render: (text, record) => <span>{Array.isArray(text) ? text[0].name : ""}</span>
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 180,
                render: (text, record) =>
                    <Row>
                        <Button size="middle" onClick={() => this.setState({ editVisible: true, user: record, type: 'edit' })}>编辑</Button>
                        <Divider type="vertical"></Divider>
                        <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record)}>
                            <Button size="middle" type="danger">删除</Button>
                        </Popconfirm>
                    </Row>
            },
        ]
        const { staff, editVisible, user, selectedRowKeys, type, dict } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: "radio"
        };
        const title = (
            <div>
                <Button type="primary" onClick={() => this.setState({ editVisible: true, user: {}, type: 'add' })} style={{ marginRight: "20px" }}>新增用户</Button>
                <Button type="primary" onClick={this.showEditModal} disabled={!this.state.selectedRowKeys.length}>重置密码</Button>
            </div>)
        return (
            <div className="role">
                <Card title={title}>
                    <Table
                        bordered
                        rowKey="_id"
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