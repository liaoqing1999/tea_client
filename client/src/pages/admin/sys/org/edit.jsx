import React, { Component } from "react";
import { Select, Form, Button, Input } from 'antd'
import { reqStaffName } from "../../../../api";
import Place from "../../../../components/place";
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
export default class EditOrg extends Component {
    state = {
        org: {}
    }
    form = React.createRef();
    //接收父组件属性前
    componentWillReceiveProps(nextProps) {
        const { org } = nextProps
        this.form.current.setFieldsValue({
            'name': org.name,
            "phone": org.phone,
            "corporation": org.corporation,
            "license": org.license,
            "org": org.org,
            "email": org.email,
            "place":  org.place?org.place.split("-"):"",
            "remark": org.remark,
            "state": org.state,
            "staffProduce": org.staffProduce,
            "description": org.description
        });
    }
    getOption = () => {
        const dict = this.props.dict
        let i = 0
        return dict["state"].reduce((pre, item) => {
            pre.push((
                <Option key={i} value={item.valueId}>{item.valueName}</Option>
            ))
            i++
            return pre
        }, [])
    }
    render() {
        const { org } = this.props
        return (<div>
            <Form size="small" {...layout} ref={this.form} onFinish={this.props.onFinish} validateMessages={validateMessages}
                initialValues={{
                    'name': org.name,
                    "phone": org.phone,
                    "corporation": org.corporation,
                    "license": org.license,
                    "org": org.org,
                    "email": org.email,
                    "place": org.place?org.place.split("-"):"",
                    "remark": org.remark,
                    "state": org.state,
                    "staffProduce": org.staffProduce,
                    "description": org.description
                }}>
                <Form.Item name='name' label="机构名" rules={[{ required: true }]}>
                    <Input disabled={this.props.type === 'edit'} />
                </Form.Item>
                <Form.Item name='corporation' label="机构法人">
                    <Input />
                </Form.Item>
                <Form.Item name='phone' label="机构电话" rules={[ { pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"), message: '请输入正确的手机号' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='license' label="机构生产许可证编号">
                    <Input />
                </Form.Item>
                <Form.Item name='place' label="地点" >
                    <Place></Place>
                </Form.Item>
                <Form.Item name='email' label="电子邮箱" rules={[{ type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name='staffProduce' label="允许非管理员新建产品">
                    <Select placeholder="请选择" >
                        <Option value={true}>是</Option>
                        <Option value={false}>否</Option>
                    </Select>
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
                <Form.Item name='description' label="机构描述">
                    <Input.TextArea autoSize />
                </Form.Item>
                <Form.Item name='remark' label="备注">
                    <Input.TextArea autoSize />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">提交 </Button>
                    <Button type="link" onClick={this.props.hideModal}>取消</Button>
                </Form.Item>
            </Form>
        </div>)
    }
}