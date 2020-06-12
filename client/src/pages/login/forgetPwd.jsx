import React, { Component } from "react";
import './login.less';
import logo from '../../assets/GREEN_TEA.svg'
import { Form, Input, Button, message, Steps, Result } from 'antd';
import { reqStaffSendVerification, reqStaffUpdatePwdByEmail, reqStaffNameEmail, reqStaffVerificationCheck } from '../../api/index'
import { UserOutlined, SolutionOutlined, SmileOutlined } from '@ant-design/icons';
const { Step } = Steps
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
    labelCol: { span: 7 },
    wrapperCol: { span: 12 },
};

let code = null
export class ForgetPwd extends Component {
    state = {
        current: 0,
        operation: "emailPassword",
        buttonText: "获取验证码",
        count: 0,
        user: {}
    }
    form = React.createRef();
    pform = React.createRef();
    onStepChange = current => {
        this.setState({ current });
    };
    countBegin = () => {
        this.interval = setInterval(() => {
            let { count } = this.state
            let buttonText
            if (count > 0) {
                buttonText = count + "s重试"
                count--
            } else {
                buttonText = "获取验证码"
                clearInterval(this.interval)
            }
            this.setState({ buttonText, count })
        }, 1000)
    }
    sendEmail = () => {
        this.form.current.validateFields(['name', 'email']).then(async values => {
            this.setState({ buttonText: "邮件发送中，请稍后", count: 60 })
            const res = await reqStaffNameEmail(values.name, values.email)
            const data = res.data
            if (data.code === 200) {
                const user = data.data
                const re = await reqStaffSendVerification(user.id, this.state.operation)
                const da = re.data
                if (da.code === 200) {
                    message.success("邮件发送成功，请及时查收！")
                    this.setState({ buttonText: "邮件发送中，请稍后", user })
                    this.countBegin()
                } else {
                    this.setState({ buttonText: "获取验证码", count: 0, user: {} })
                    message.error(da.message)
                }
            } else {
                message.error(data.message)
            }
        }).catch(errorInfo => {
            console.log(errorInfo)
        });
    }
    emailFinish = async (values) => {
        const res = await reqStaffVerificationCheck(values.email, values.code, this.state.operation)
        const data = res.data
        if (data.code === 200) {
            message.success(data.data)
            this.setState({ current: 1 })
            code = values.code
        } else {
            message.error(data.message)
            code = null
        }
    }
    passwordFinish = async (values) => {
        const { user, operation } = this.state
        const res = await reqStaffUpdatePwdByEmail(user.id, values.password, code, operation)
        const data = res.data
        if (data.code === 200) {
            message.success(data.data)
            this.setState({ current: 2 })
        } else {
            message.error(data.message)
        }
    }
    render() {
        let { current, buttonText, count, user } = this.state
        if (current > 0 && code === null) {
            current = 0
        }
        const email = (
            <Form {...layout} ref={this.form} onFinish={this.emailFinish} validateMessages={validateMessages}>
                <Form.Item name='name' label="用户名" rules={[{ required: true }]}>
                    <Input placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item name='email' label="邮箱" rules={[{ required: true, type: 'email' }]}>
                    <Input placeholder="请输入账户绑定的邮箱" />
                </Form.Item>
                <Form.Item label="邮箱验证码" rules={[{ required: true }]} hasFeedback>
                    <Form.Item name='code' rules={[{ required: true, message: '验证码不能为空' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }}>
                        <Input placeholder="请输入收到的验证码" />
                    </Form.Item>
                    <Button disabled={count > 0} onClick={() => {
                        this.sendEmail()
                    }} style={{ marginLeft: "10px", display: 'inline-block', width: 'calc(50% - 15px)' }}>
                        {buttonText}
                    </Button>
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 7 }}>
                    <Button type="primary" htmlType="submit"  >
                        下一步
                    </Button>
                </Form.Item>
            </Form>
        )
        const password = (
            <Form {...layout} ref={this.pform} onFinish={this.passwordFinish} validateMessages={validateMessages}
                initialValues={{
                    'name': user.name,
                    "password": "",
                    "confirm": "",
                }}>
                <Form.Item name='name' label="用户名">
                    <Input disabled />
                </Form.Item>
                <Form.Item name='password' label="新密码" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="confirm" validateTrigger="onBlur" label="确认新密码"
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
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 7 }}>
                    <Button type="primary" htmlType="submit"  >
                        下一步
                    </Button>
                </Form.Item>
            </Form>
        )
        const result = (
            <Result
                status="success"
                title="修改密码成功!"
                subTitle="现在您可以使用您的新密码进行登录了，请保管好您的密码"
                extra={[
                    <Button type="primary" key="goLogin" onClick={() => { this.props.history.replace("/login") }}>
                        去登录
                    </Button>
                ]}
            />
        )
        const content = [
            email,
            password,
            result
        ]
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"></img>
                    <h1>喝好茶溯源系统</h1>
                </header>
                <section className="login-content" style={{ width: "50%" }}>
                    <h2>忘记密码</h2>
                    <div>
                        <Steps current={current} style={{ marginTop: "10px", marginBottom: "20px" }} >
                            <Step title="邮箱验证" icon={<SolutionOutlined />} />
                            <Step title="修改密码" icon={<UserOutlined />} />
                            <Step title="完成" icon={<SmileOutlined />} />
                        </Steps>
                        <div style={{ height: "270px" }}>{content[current]}</div>
                    </div>
                </section>
            </div>
        )
    }
}

export default ForgetPwd
