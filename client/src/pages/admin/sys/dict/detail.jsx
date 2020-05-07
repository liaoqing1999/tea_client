import React, { Component } from 'react';
import {reqDictAdd, reqDictUpdate, reqDictDelete, reqDictPage } from '../../../../api'
import { Table, Button, Row, Divider, Popconfirm, Modal, Form, Input, message, Select } from 'antd';
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const { Option } = Select
const validateMessages = {
    required: '${label} 是必须的!',
    types: {
        email: '${label} 格式不正确',
        number: '${label} 格式不正确!',
    },
    number: {
        range: '${label}必须在 ${min} —— ${max}之间',
    },
};
export default class DictDetail extends Component {
    state = {
        dict: [],
        type: "",
        record: {},
        editVisible: false,
        state: []
    }
    form = React.createRef();
    getDict = async (typeCode) => {
        const res = await reqDictPage(typeCode)
        if (res.data.data) {
            const dict = res.data.data
            this.setState({ dict })
        }
        const r = await reqDictPage("state")
        if (r.data.data) {
            const state = r.data.data
            this.setState({ state })
        }
    }
    getDictValue = (id) => {
        const { state } = this.state
        if (Array.isArray(state)) {
            const result = state.find(item => item.valueId === id)
            if (result) {
                return result.valueName
            } else {
                return id
            }
        }
    }
    onFinish = async (values) => {
        const {type,record } = this.state
        const { state } = this.props.location
        values.typeCode = state.dictType._id
        values.typeName = state.dictType.typeName
        if (type === 'add') {
            const res = await reqDictAdd(values)
            if (res.data.data) {
                message.success("新增成功")
                this.setState({ editVisible: false })
                this.getDict(state.dictType._id)
            }
        } else {
            values.id = record.id
            const res = await reqDictUpdate(values)
            if (res.data.data) {
                message.success("修改成功")
                this.setState({ editVisible: false })
                this.getDict(state.dictType._id)
            }
        }

    }
    handleDelete = async (record) => {
        await reqDictDelete(record.id)
        message.success("删除成功")
        const { state } = this.props.location
        if (state.dictType) {
            this.getDict(state.dictType._id)
        }
    }
    componentDidMount() {
        const { state } = this.props.location
        if (state.dictType) {
            this.getDict(state.dictType._id)
        }
    }
    getOption = () => {
        const { state } = this.state
        if (Array.isArray(state)) {
            return state.reduce((pre, item) => {
                pre.push((
                    <Option key={item.id} value={item.valueId}>{item.valueName}</Option>
                ))
                return pre
            }, [])
        }
    }
    render() {
        const { state } = this.props.location
        if (!state) {
            this.props.history.goBack()
        }
        const { dict, type, record, editVisible } = this.state
        const validfunc = async (rule, value) => {
            if (type === 'add') {
                if (value) {
                    const res = await reqDictPage(state.dictType._id,value)
                    if(Array.isArray(res.data.data)&&res.data.data.length>0){
                        throw new Error("字典值已存在");
                    } else {
                        
                    }
                } else {
                    throw new Error('字典值是必须的!');
                }
            }

        }
        const columns = [
            {
                title: '字典值',
                dataIndex: 'valueId',
                key: 'valueId'
            },
            {
                title: '字典名',
                dataIndex: 'valueName',
                key: 'valueName',
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                render: (text) => this.getDictValue(text)
            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 180,
                key: 'operation',
                render: (text, record) =>
                    <Row>
                        <Button size="middle" type="primary" onClick={() => {
                            this.setState({ editVisible: true, record: record, type: 'edit' })
                            if (this.form.current) {
                                this.form.current.setFieldsValue({
                                    'valueId': record.valueId,
                                    "valueName": record.valueName,
                                    "state": record.state,
                                });
                            }
                        }}>编辑</Button>
                        <Divider type="vertical"></Divider>
                        <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record)}>
                            <Button size="middle" type="danger">删除</Button>
                        </Popconfirm>
                    </Row>
            },
        ];
        return (
            <div >
                <Modal
                    title={type === 'add' ? "新增字典" : "编辑字典"}
                    visible={editVisible}
                    footer={null}
                    bodyStyle={{ backgroundColor: "white" }}
                    onCancel={() => { this.setState({ editVisible: false }) }}
                >
                    <Form {...layout} ref={this.form} onFinish={this.onFinish} validateMessages={validateMessages}
                        initialValues={{
                            'valueId': record.valueId,
                            "valueName": record.valueName,
                            "state": record.state,
                        }}>
                        <Form.Item name='valueId' label="字典值" validateTrigger="onBlur" rules={[{ validator: validfunc }]}>
                            <Input disabled={type === 'edit'} />
                        </Form.Item>
                        <Form.Item name='valueName' label="字典名" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name='state' label="状态" rules={[{ required: true }]}>
                            <Select
                                showSearch
                                placeholder="请选择状态"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {this.getOption()}
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
                            <Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
                                提交
                            </Button>
                            <Button htmlType="button" onClick={() => this.setState({ editVisible: false })}>
                                取消
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Button style={{ marginBottom: "10px" }} type="primary" onClick={() => {
                    this.setState({ editVisible: true, record: {}, type: 'add' })
                    if (this.form.current) {
                        this.form.current.setFieldsValue({
                            'valueId':"",
                            "valueName":"",
                            "state": "",
                        });
                    }
                }}>新增字典</Button>
                <Button type="link" onClick={() => this.props.history.push("/admin/dict")} size="middle">返回类型列表</Button>
                <Table title={(c) => state.dictType.typeName} size="middle" bordered rowKey="id" columns={columns} dataSource={dict} />
            </div>
        )
    }
}