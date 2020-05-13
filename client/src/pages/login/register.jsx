import React, { Component } from "react";
import './login.less';
import logo from '../../assets/GREEN_TEA.svg'
import { Form, Select, Input, Button, message } from 'antd';
import { reqStaffName, reqAddStaff, reqFindRoleByName } from '../../api/index'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
const { Option } = Select;

const selectBefore = (
    <Select defaultValue="+86" className="select-before">
        <Option value="+86">+86</Option>
        <Option value="+87">+87</Option>
    </Select>
);
export class Register extends Component {
    handleSubmit = async (values) => {
        values.createTime = new Date()
        const r = await reqFindRoleByName('user')
        if(r.data.data&&r.data.data.length){
            const role = r.data.data[0]
            values.role = role.id
            const res = await reqAddStaff(values)
            if (res.data.data) {
                message.success("注册成功")
                this.props.history.replace("/login")
            }
        }
        
    }

    render() {
        const validfunc = async (rule, value) => {
            if (value) {
                const res = await reqStaffName(value)
                if (res.data.data === '') {

                } else {
                    throw new Error('用户名已存在!');
                }
            } else {
                throw new Error('用户名是必须的!');
            }
        }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"></img>
                    <h1>喝好茶溯源系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户注册</h2>
                    <div>
                        <Form
                            name="normal_login"
                            onFinish={this.handleSubmit}
                        >
                            <Form.Item name="name" validateTrigger="onBlur" rules={[{ validator: validfunc }]}>
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                            </Form.Item>
                            <Form.Item name="password" validateTrigger="onBlur" rules={[{ required: true, message: '请输入密码!' }]}>
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    autoComplete="off"
                                    placeholder="密码"
                                />
                            </Form.Item>
                            <Form.Item name="confirm"
                                validateTrigger="onBlur"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (value) {
                                                if (getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('两次输入密码不一致!');
                                            } else {
                                                return Promise.reject('请输入确认密码!');
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    autoComplete="off"
                                    placeholder="确认密码"
                                />
                            </Form.Item>
                            <Form.Item validateTrigger="onBlur" name='phone' rules={[{ pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"), message: '请输入正确的手机号！' }]} >
                                <Input placeholder="电话号码" addonBefore={selectBefore} />
                            </Form.Item>
                            <Form.Item validateTrigger="onBlur" name='email' rules={[{ type: 'email', message: '请输入正确的邮箱!' }]} >
                                <Input placeholder="邮箱" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" style={{ width: "100%" }} htmlType="submit" className="login-form-button">
                                    注册
                                </Button>
                            </Form.Item>
                            <Button type="link" size="small" onClick={() => { this.props.history.replace("/login") }}>已有账号？立即登录!</Button>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}

export default Register
