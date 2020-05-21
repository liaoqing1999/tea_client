import React from "react";
import { Select, Form, Input, Button, message } from 'antd'
import { reqGetTea, reqUpdateProcess } from "../../../../api";
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
export default class AddUFProcess extends React.Component {
    state = {
        tea: {}
    }
    form = React.createRef();
    onFinish = async (values) => {
        const res = await reqGetTea(values.id)
        if (res.data.data) {
            const tea = res.data.data
            if (tea.processFinish) {
                message.error("id为" + values.id + "的茶叶的加工阶段已经完成")
            } else {
                const user = memoryUtils.user
                tea.process = tea.process ? tea.process : []
                values.startDate = new Date()
                values.endDate = new Date()
                if (values.processer) {

                } else {
                    values.processer = user.id
                }
                values.finish = false
                tea.process.push(values)
                await reqUpdateProcess(tea)

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
        if (id) {
            this.getTea(id)
        }
        this.form.current.setFieldsValue({
            'id': id,
            'method': "",
            'processer':""
        });
    }
    componentDidMount = () => {
        const { id } = this.props
        if (id) {
            this.getTea(id)
        }
    }
    getOption = () => {
        const dict = this.props.dict
        let i = 0
        return dict["process"].reduce((pre, item) => {
            pre.push((
                <Option key={i} value={item.valueId}>{item.valueName}</Option>
            ))
            i++
            return pre
        }, [])
    }
    render() {
        const { id } = this.props
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.onFinish} validateMessages={validateMessages}
                initialValues={{
                    'id': id,
                    'method': "",
                    'processer':""
                }}>
                <Form.Item name="id" label="茶叶id" validateTrigger='onSubmit' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="method" label="加工方法" rules={[{ required: true }]}>
                    <Select
                        showSearch
                        placeholder="请选择加工方法"
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