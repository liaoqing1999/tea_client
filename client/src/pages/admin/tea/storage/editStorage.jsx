import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Form, Button, DatePicker, message, Input } from 'antd'
import { reqUpdateStorage } from "../../../../api";
import memoryUtils from "../../../../utils/memoryUtils";
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
export default class EditStorage extends React.Component {
    state = {
        tea: null
    }
    form = React.createRef();
    //接收父组件属性前
    componentWillReceiveProps(nextProps) {
        const { tea } = nextProps
        tea.storage = tea.storage ? tea.storage : {}
        let storage = tea.storage
        this.form.current.setFieldsValue({
            'place': storage.place,
            'startDate': storage.startDate ? moment(storage.startDate, 'YYYY-MM-DD') : "",
            'endDate': storage.endDate ? moment(storage.endDate, 'YYYY-MM-DD') : "",
        });
    }
    onFinish = async (values) => {
        let storage = {}
        const { tea } = this.props
        const user = memoryUtils.user
        storage.place = values.place
        storage.startDate = new Date(values.startDate.valueOf())
        if (values.endDate) {
            storage.endDate = new Date(values.endDate.valueOf())
        }
        storage.finish = tea.storage.finish
        storage.img = tea.storage.img
        storage.storageer = user.id
        tea.storage = storage
        const res = await reqUpdateStorage(tea)
        if (res.data.data.id) {
            message.success("修改成功")
            this.props.hideModal()
        }
    }
    render() {
        const { tea } = this.props
        let storage = tea.storage
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.onFinish}
                initialValues={{
                    'place': storage.place,
                    'startDate': storage.startDate ? moment(storage.startDate, 'YYYY-MM-DD') : "",
                    'endDate': storage.endDate ? moment(storage.endDate, 'YYYY-MM-DD') : "",
                }}>
                <Form.Item name="place" label="仓储地点" rules={[{ required: true, message: '仓储地点是必填的' }]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="startDate" label="开始时间" rules={[{ required: true, message: '开始时间是必填的' }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item name="endDate" label="结束时间"
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue("startDate") < value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('开始时间不能大于结束时间!');
                            },
                        }),
                    ]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">提交 </Button>
                    <Button type="link" onClick={this.props.hideModal}>取消</Button>
                </Form.Item>
            </Form>
        </div>)
    }
}