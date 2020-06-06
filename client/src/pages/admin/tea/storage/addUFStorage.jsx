import React from "react";
import { Form, Input, Button, message } from 'antd'
import { reqGetTea, reqUpdateStorage } from "../../../../api";
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
export default class AddUFStorage extends React.Component {
    state = {
        tea: {}
    }
    form = React.createRef();
    onFinish = async (values) => {
        const res = await reqGetTea(values.id)
        if (res.data.data) {
            const tea = res.data.data
            values.startDate = new Date()
            const user = memoryUtils.user
            if (values.storageer) {

            } else {
                values.storageer = user.id
            }
            values.finish = false
            if (tea.storage) {
                if (tea.storage.storageer && tea.storage.storageer !== user.id) {
                    message.error("id为" + values.id + "的茶叶的仓储阶段已经分配负责人")
                    return
                } else if (tea.storage.finish) {
                    message.error("id为" + values.id + "的茶叶的仓储阶段已经完成")
                    return
                } else {
                    tea.storage = values
                }
            } else {
                tea.storage = values
            }
            await reqUpdateStorage(tea)
            message.success("增加成功")
            this.props.hideModal()
            this.props.addRefresh()
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
            'place': "",
            'storageer': ""
        });
    }
    render() {
        const { id } = this.props
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.onFinish} validateMessages={validateMessages}
                initialValues={{
                    'id': id,
                    'place': "",
                    'storageer': ""
                }}>
                <Form.Item name="id" label="茶叶id" validateTrigger='onSubmit' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="place" label="仓储地点" rules={[{ required: true }]}>
                    <Input></Input>
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">提交 </Button>
                    <Button type="link" onClick={this.props.hideModal}>取消</Button>
                </Form.Item>
            </Form>
        </div>)
    }
}