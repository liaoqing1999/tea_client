import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Select, Form, Input, Button, DatePicker, message } from 'antd'
import { reqUpdatePlant } from "../../../../api";
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
export default class AddTea extends React.Component {
    state = {
        tea: null
    }
    form = React.createRef();
    onFinish = async (values) => {
        let pesticide = {}
        pesticide.name = values.name
        pesticide.date = new Date(values.date.valueOf())
        const tea = this.props.tea
        let msg = ""
        if (tea.index === -1) {
            tea.plant.pesticide.push(pesticide)
            msg = "新增成功！"
        } else {
            tea.plant.pesticide[tea.index] = pesticide
            msg = "修改成功！"
        }
        const res = await reqUpdatePlant(tea)
        if (res.data.data.id) {
            message.success(msg)
        }
        this.props.hideModal()
    }
    getOption = () => {
        const dict = this.props.dict
        let i = 0
        return dict["pesticide"].reduce((pre, item) => {
            pre.push((
                <Option key={i} value={item.valueId}>{item.valueName}</Option>
            ))
            i++
            return pre
        }, [])
    }
    render() {
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.onFinish} validateMessages={validateMessages}>
                <Form.Item name="name" label="茶叶名" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="name" label="茶叶类型" rules={[{ required: true }]}>
                    <Select
                        showSearch
                        placeholder="请选择茶叶类型"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {this.getOption()}
                    </Select>
                </Form.Item>
                <Form.Item name="name" label="茶叶批次">
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="所属产品" rules={[{ required: true }]}>
                    <Select
                        showSearch
                        placeholder="请选择所属产品"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {this.getOption()}
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