import React, { Component } from 'react'
import { Form, Modal, Input, Card, Button, Table, Popconfirm, message } from 'antd'
import { reqRolePage, reqFindRoleByName, reqDeleteRole, reqAddRole } from '../../../api'
import { formateDate } from '../../../utils/dateUtils'
import memoryUtils from '../../../utils/memoryUtils';
import EditRole from './edit';
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


export default class Role extends Component {
    state = {
        roles: [],
        columns: [],
        role: null,
        selectedRowKeys: [],
        addVisible: false,
        editVisible: false,
        total: 0,
        current: 1,
        pageSize: 10
    }
    componentWillMount() {
        this.initColumn()
    }
    componentDidMount() {
        this.getDate(this.state.current, this.state.pageSize)
    }
 
    //表行选中触发事件
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, role: selectedRows[0] });

    };
    getDate = async (page, rows) => {
        const res = await reqRolePage(page, rows)
        const result = res.data.data
        if (result.content) {
            this.setState({
                roles: result.content,
                total: result.total,
                current: result.page,
                pageSize: result.rows,
            })
        }

    }
    paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: () => `共${this.state.total}条`,
        total: this.state.totals,
        onShowSizeChange: (current, pageSize) => this.changePageSize(pageSize, current),
        onChange: (current) => this.changePage(current),
    };
    changePage = (current) => {
        this.getDate(current, this.state.pageSize)
    }
    onRow = (role) => {
        const _this = this
        return {
            onClick: event => {
                if (_this.state.selectedRowKeys[0] === role.id) {
                    _this.setState({ selectedRowKeys: [] })
                } else {
                    _this.setState({ selectedRowKeys: [role.id], role: role })
                }
            }
        }

    }
    showAddModal = () => {
        this.setState({
            addVisible: true,
        });
    };

    hideAddModal = () => {
        this.setState({
            addVisible: false,
        });
    };
    showEditModal = () => {
        this.setState({
            editVisible: true,
        });
    };

    hideEditModal = () => {
        this.setState({
            editVisible: false,
        });
    };
    onFinish = async (values) => {
        const role = values.role
        role.createTime = new Date()
        role.authName = memoryUtils.user.name
        const res = await reqAddRole(role)
        if (res.data.data.id) {
            message.success("增加成功")
            // this.setState(state => ({
            //     roles:[...this.state.roles,role]
            // }))
            this.getDate(this.state.current, this.state.pageSize)
            this.hideAddModal()
        } else {
            message.error("增加失败")
        }
    }
    handleDelete = async (record) => {
        console.log(record)
        if(record.name ==='superAdmin'){
            message.error("不能删除超级管理员")
        }else{
            await reqDeleteRole(record.id)
            this.getDate(this.state.current, this.state.pageSize)
        }
      
    }
    initColumn = () => {
        const columns = [
            {
                title: 'id',
                dataIndex: 'id'
            },
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                render: date => formateDate(date)
            },
            {
                title: '授权时间',
                dataIndex: 'authTime',
                render: date => formateDate(date)
            },
            {
                title: '授权人',
                dataIndex: 'authName'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.roles.length >= 1 ? (
                        <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record)}>
                            <Button type="danger">删除</Button>
                        </Popconfirm>
                    ) : null,
            },
        ]

        this.setState({ columns: columns })
    }
    render() {
        const { roles, role, columns, selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: "radio"
        };
        const title = (
            <div>
                <Button type="primary" onClick={this.showAddModal} style={{ marginRight: "20px" }}>创建角色</Button>
                <Button type="primary" onClick={this.showEditModal} disabled={!this.state.selectedRowKeys.length}>设置角色权限</Button>
            </div>)
        return (
            <div className="role">
                <Card title={title}>
                    <Table
                        bordered
                        rowKey="id"
                        dataSource={roles}
                        columns={columns}
                        pagination={this.paginationProps}
                        rowSelection={rowSelection}
                        onRow={this.onRow}
                    />
                </Card>
                <Modal
                    title="增加角色"
                    visible={this.state.addVisible}
                    footer={null}
                    bodyStyle={{ backgroundColor: "white" }}
                    onCancel={this.hideAddModal}
                >
                    <Form {...layout} name="role" onFinish={this.onFinish}>
                        <Form.Item name={['role', 'name']} label="角色名" validateTrigger='onSubmit' rules={[{ validator: validfunc }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
                            <Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
                                提交
                            </Button>
                            <Button htmlType="button" onClick={this.hideAddModal}>
                                取消
                        </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={this.state.editVisible}
                    footer={null}
                    bodyStyle={{ backgroundColor: "white" }}
                    onCancel={this.hideEditModal}
                >
                    <EditRole getDate={this.getDate} hideEditModal={this.hideEditModal}  role ={role}></EditRole>
                </Modal>
            </div>
        )
    }
}