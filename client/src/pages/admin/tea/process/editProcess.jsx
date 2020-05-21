import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Select, Form, Button, DatePicker, message } from 'antd'
import { reqUpdateProcess } from "../../../../api";
import memoryUtils from "../../../../utils/memoryUtils";
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const { Option } = Select;
export default class EditProcess extends React.Component {
    state = {
        tea: null
    }
    form = React.createRef();
    //接收父组件属性前
    componentWillReceiveProps(nextProps) {
        const { tea, index } = nextProps
        let process = {}
        if (index === -1) {
            process.startDate = new Date()
            process.endDate = new Date()
        } else {
            if (Array.isArray(tea.process)) {
                process = tea.process[index] ? tea.process[index] : {}
            } else {
                tea.process = []
            }
        }
        this.form.current.setFieldsValue({
            'method': process.method,
            'startDate': moment(process.startDate, 'YYYY-MM-DD'),
            'endDate': moment(process.endDate, 'YYYY-MM-DD'),
            'finish': process.finish,
        });
    }
    onFinish = async (values) => {
        let process = {}
        const user = memoryUtils.user
        process.method = values.method
        process.startDate = new Date(values.startDate.valueOf())
        process.endDate = new Date(values.endDate.valueOf())
        process.finish = values.finish
        process.processer = user.id
        const { tea, index } = this.props
        let msg = ""
        if (index === -1) {
            tea.process.push(process)
            msg = "新增成功！"
        } else {
            tea.process[index] = process
            msg = "修改成功！"
        }
        const res = await reqUpdateProcess(tea)
        if (res.data.data.id) {
            message.success(msg)
        }
        this.props.hideModal()
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
        const { tea, index } = this.props
        let process = {}
        if (index === -1) {
            process.startDate = new Date()
            process.endDate = new Date()
        } else {
            if (Array.isArray(tea.process)) {
                process = tea.process[index] ? tea.process[index] : {}
            } else {
                tea.process = []
            }
        }
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.onFinish}
                initialValues={{
                    'method': process.method,
                    'startDate': moment(process.startDate, 'YYYY-MM-DD'),
                    'endDate': moment(process.endDate, 'YYYY-MM-DD'),
                    'finish': process.finish,
                }}>
                <Form.Item name="method" label="加工方法" rules={[{ required: true, message: '加工方法是必填的' }]}>
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
                <Form.Item name="startDate" label="开始时间">
                    <DatePicker />
                </Form.Item>
                <Form.Item name="endDate" label="结束时间"
                    rules={[{ required: true },
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
                <Form.Item name="finish" label="是否完成" rules={[{ required: true, message: '农药名是必填的' }]}>
                    <Select
                        showSearch
                        placeholder="请选择是否完成"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option value={true}>是</Option>
                        <Option value={false}>否</Option>
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