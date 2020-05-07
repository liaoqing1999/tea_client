import React, { Component } from 'react';
import { reqDictTypePage, reqDictTypeName, reqDictTypeAdd, reqDictTypeUpdate, reqDictTypeDelete } from '../../../../api'
import { Table, Button, Row, Divider, Popconfirm, Modal, Form, Input, message } from 'antd';
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
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
export default class Dict extends Component {
    state = {
        dictType: [],
        type: "",
        record: {},
        editVisible: false
    }
    form = React.createRef();
    getDict = async (cond) => {
        const res = await reqDictTypePage(cond)
        if (res.data.data) {
            const dictType = res.data.data
            this.setState({ dictType })
        }
    }
    onFinish = async (values) => {
        const {type } = this.state
        if (type === 'add') {
            const res = await reqDictTypeAdd(values)
            if (res.data.data) {
                message.success("新增成功")
                this.setState({editVisible:false})
                this.getDict()  
            }
        } else {
            const res = await reqDictTypeUpdate(values.typeCode, values.typeName)
            if (res.data.data) {
                message.success("修改成功")
                this.setState({editVisible:false})
                this.getDict()
            }
        }

    }
    handleDelete =async (record) => {
        await reqDictTypeDelete(record._id)
        message.success("删除成功")
        this.getDict()
    }
    componentDidMount() {
        this.getDict()
    }
    render() {
        const { dictType, type, record, editVisible } = this.state
        const validfunc = async (rule, value) => {
            if (type === 'add') {
                if (value) {
                    const res = await reqDictTypeName(value)
                    if (res.data.data === '') {

                    } else {
                        throw new Error(res.data.data);
                    }
                } else {
                    throw new Error('用户名是必须的!');
                }
            }

        }
        const columns = [
            {
                title: '类型Code',
                dataIndex: '_id',
                key: 'id',
                render: (text,record) => <Button onClick={() =>  this.props.history.push("/admin/dict/detail",{dictType:record})} type="link">{text}</Button>
            },
            {
                title: '类型名',
                dataIndex: 'typeName',
                key: 'typeName',
            },
            {
                title: '字典数量',
                dataIndex: 'count',
                key: 'count',
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
                                    'typeCode': record._id,
                                    "typeName": record.typeName
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
                    title={type === 'add' ? "新增字典类型" : "编辑字典类型"}
                    visible={editVisible}
                    footer={null}
                    bodyStyle={{ backgroundColor: "white" }}
                    onCancel={() => { this.setState({ editVisible: false }) }}
                >
                    <Form {...layout} ref={this.form} onFinish={this.onFinish} validateMessages={validateMessages}
                        initialValues={{
                            'typeCode': record._id,
                            "typeName": record.typeName
                        }}>
                        <Form.Item name='typeCode' label="类型Code" validateTrigger="onBlur" rules={[{ validator: validfunc }]}>
                            <Input disabled={type === 'edit'} />
                        </Form.Item>
                        <Form.Item name='typeName' label="类型名" rules={[{ required: true }]}>
                            <Input />
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
                            'typeCode': "",
                            "typeName": ""
                        });
                    }
                }}>新增字典类型</Button>
                <Table size="middle" bordered rowKey="_id" columns={columns} dataSource={dictType} />
            </div>
        )
    }
}