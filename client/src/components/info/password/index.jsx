import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import memoryUtils from '../../../utils/memoryUtils';
import { reqUpdatePassword } from '../../../api';
import storageUtils from '../../../utils/storageUtils';
import sessionUtils from '../../../utils/sessionUtils';
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
const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 },
};
export default class UserPassword extends Component {
    state = {
        user: memoryUtils.user,
    }
    onFinish =async (values) => {
        const { user } = this.state
        const res = await reqUpdatePassword(user.id, values.password)
        message.success("修改成功")
        storageUtils.removeUser();
        memoryUtils.user = {};
        storageUtils.removeRole();
        memoryUtils.role = {};
        sessionUtils.remove('org')
        this.props.history.push('/login')
    }
    render() {
        const { user } = this.state
        const validfunc = async (rule, value) => {
            if (user.password) {
                if (value) {
                    if (value !== user.password) {
                        throw new Error('旧密码不正确!');
                    }
                } else {
                    throw new Error('旧密码是必须的!');
                }
            }
        }
        return (
            <div className="top">
                <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}
                    initialValues={{
                        'name': user.name
                    }}>

                    <Form.Item name='name' label="用户名">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name='oldPassword' label="旧密码" validateTrigger="onBlur" rules={[{ validator: validfunc }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name='password' label="新密码" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="confirm" validateTrigger="onBlur" label="确认密码"
                        rules={[{ required: true },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('两次输入密码不一致!');
                            },
                        }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
                        <Button type="primary" htmlType="submit">
                            提交修改
                                </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}