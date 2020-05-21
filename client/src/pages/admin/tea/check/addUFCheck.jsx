import React from "react";
import { Select, Form, Input, Button, message } from 'antd'
import { reqGetTea, reqUpdateCheck } from "../../../../api";
import memoryUtils from "../../../../utils/memoryUtils";
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
export default class AddUFCheck extends React.Component {
    state = {
        tea: {}
    }
    form = React.createRef();
    onFinish = async (values) => {
        const res = await reqGetTea(values.id)
        if (res.data.data) {
            const tea = res.data.data
            if (tea.checkFinish) {
                message.error("id为" + values.id + "的茶叶的检测阶段已经完成")
            } else {
                const user = memoryUtils.user
                tea.check = tea.check ? tea.check : []
                values.date = new Date()
                if (values.checker) {

                } else {
                    values.checker = user.id
                }
                values.finish = false
                tea.check.push(values)
                await reqUpdateCheck(tea)

                message.success("添加成功")
                this.props.hideModal()
                this.props.addRefresh()
            }

        } else {
            message.error("没有找到id为" + values.id + "的茶叶")
        }

    }
    getTea = async (id) => {
        const res = await reqGetTea(id)
        if (res.data.data) {
            this.setState({ tea: res.data.data })
        }
    }
    componentWillReceiveProps(nextProps) {
        const { id } = nextProps
        this.form.current.setFieldsValue({
            'id': id,
            'typeId': "",
            'checker':""
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
        const { id } = this.props
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.onFinish} validateMessages={validateMessages}
                initialValues={{
                    'id': id,
                    'typeId': "",
                    'checker':""
                }}>
                <Form.Item name="id" label="茶叶id" validateTrigger='onSubmit' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="typeId" label="检测类型" rules={[{ required: true, message: '检测类型是必填的' }]}>
                    <Select
                        showSearch
                        placeholder="请选择检测类型"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {this.getOption('check')}
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