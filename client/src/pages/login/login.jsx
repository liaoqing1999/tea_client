import React, { Component } from "react";
import './login.less';
import logo from '../../assets/GREEN_TEA.svg'
import { Form, Checkbox, Input, Button, message } from 'antd';
import { reqLogin } from '../../api/index'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
const creatHistory = require("history").createBrowserHistory
const history = creatHistory();
export class Login extends Component {
    handleSubmit = async (values) => {
        //阻止事件的默认行为
        //event.preventDefault()
        const { account, password } = values;
        const res = await reqLogin(account, password)
        if (res.data.data.id) {
            const user = res.data.data
            message.success("登陆成功")
            memoryUtils.user = user //保存在内存中
            storageUtils.savaUser(user)
            history.goBack();
        } else {
            message.error(res.data.data)
        }
    }

    render() {
        //如果用户已经登录，自动跳转到首页
        const user = memoryUtils.user
        console.log(user)
        if (user && user.id) {
            history.goBack();
        }
        //const form = this.props.form;
        //const { getFieldDecorator } = form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"></img>
                    <h1>喝好茶溯源系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <div>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                            onFinish={this.handleSubmit}
                        >
                            <Form.Item
                                name="account"
                                rules={[{ required: true, message: '请输入你的账户!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Account" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: '请输入你的密码!' }]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>记住密码</Checkbox>
                                </Form.Item>
                                <a className="login-form-forgot" href="#">
                                    忘记密码
                            </a>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                            </Button>
                            Or <a href="#">立即注册!</a>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}

export default Login

/*
async和await
1.作用
简化promise对象的使用，消灭了then，不用在使用then（）来指定成功/失败的回调函数
以异步编码方式实现异步流程

2.哪里写await
在返回promise的表达式左侧写await：不想要promise，想要promise异步执行成功的value数据

3.哪里写async
await所在函数（最近的）定义的左侧写async
*/