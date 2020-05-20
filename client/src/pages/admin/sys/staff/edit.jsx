import React, { Component } from "react";
import { Select, Form, Button, Input } from 'antd'
import { GetOrgSelect, GetRoleSelect } from './orgRoleSelect'
import { reqStaffName } from "../../../../api";
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
const { Option } = Select;
export default class EditStaff extends Component {
    state = {
        user: null
    }
    form = React.createRef();
    //接收父组件属性前
    componentWillReceiveProps(nextProps) {
        const { user } = nextProps
        this.form.current.setFieldsValue({
            'name': user.name,
            "realName": user.realName,
            "phone": user.phone,
            "card": user.card,
            "work": user.work,
            "org": user.org,
            "email": user.email,
            "sex": user.sex,
            "role": user.role,
            "state": user.state,
            "password": user.password
        });
    }
    getOption = (name) => {
        const dict = this.props.dict
        return dict[name].reduce((pre, item) => {
            pre.push((
                <Option key={item.id} value={item.valueId}>{item.valueName}</Option>
            ))
            return pre
        }, [])
    }
    render() {
        const { user } = this.props
        const validfunc = async (rule, value) => {
            if (!user.name) {
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

        }
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.props.onFinish} validateMessages={validateMessages}
                initialValues={{
                    'name': user.name,
                    "realName": user.realName,
                    "phone": user.phone,
                    "card": user.card,
                    "work": user.work,
                    "org": user.org,
                    "email": user.email,
                    "role": user.role,
                    "sex": user.sex,
                    "state": user.state,
                    "password": user.password
                }}>
                <Form.Item name='name' label="用户名" validateTrigger="onBlur" rules={[{ validator: validfunc }]}>
                    <Input disabled={this.props.type === 'edit'} />
                </Form.Item>
                {this.props.type === 'edit' ? ("") :
                    (<Form.Item name='password' label="密码" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    )}
                <Form.Item name='realName' label="真实姓名">
                    <Input />
                </Form.Item>
                <Form.Item name='sex' label="性别" >
                    <Select
                        showSearch
                        placeholder="请选择性别"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {this.getOption('sex')}
                    </Select>
                </Form.Item>
                <Form.Item name='phone' label="电话号码" rules={[{ required: true }, { pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"), message: '请输入正确的手机号' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='card' label="身份证号码">
                    <Input />
                </Form.Item>
                <Form.Item name='work' label="工作">
                    <Input />
                </Form.Item>
                {this.props.editType === 'sys' ? (
                    <Form.Item name='org' label="机构">
                        <GetOrgSelect></GetOrgSelect>
                    </Form.Item>)
                :("")}
                <Form.Item name='email' label="电子邮箱" rules={[{ type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='role' label="角色" rules={[{ required: true }]}>
                    <GetRoleSelect></GetRoleSelect>
                </Form.Item>
                <Form.Item name='state' label="状态" rules={[{ required: true }]}>
                    <Select
                        showSearch
                        placeholder="请选择用户状态"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {this.getOption("state")}
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">提交 </Button>
                    <Button type="link" onClick={this.props.hideModal}>取消</Button>
                </Form.Item>
            </Form>
        </div>)
    }
}