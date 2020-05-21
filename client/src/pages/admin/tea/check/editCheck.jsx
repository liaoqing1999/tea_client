import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Select, Form, Button, DatePicker, message } from 'antd'
import {reqUpdateCheck } from "../../../../api";
import memoryUtils from "../../../../utils/memoryUtils";
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const { Option } = Select;
export default class EditCheck extends React.Component {
    state = {
        tea: null
    }
    form = React.createRef();
    //接收父组件属性前
    componentWillReceiveProps(nextProps) {
        const { tea, index } = nextProps
        let check = {}
        if (index === -1) {
        } else {
            if (Array.isArray(tea.check)) {
                check = tea.check[index] ? tea.check[index] : {}
            } else {
                tea.check = []
            }
        }
        this.form.current.setFieldsValue({
            'typeId': check.typeId,
            'date':check.date ? moment(check.date, 'YYYY-MM-DD') : "", 
            'result':check.result, 
            'finish': check.finish,
        });
    }
    onFinish = async (values) => {
        let check = {}
        const user = memoryUtils.user
        check.typeId = values.typeId
        check.date = new Date(values.date.valueOf())
        check.finish = values.finish
        check.result = values.result
        check.checker = user.id
        const { tea, index } = this.props
        let msg = ""
        if (index === -1) {
            tea.check.push(check)
            msg = "新增成功！"
        } else {
            check.info = tea.check[index].info
            tea.check[index] = check
            msg = "修改成功！"
        }
        const res = await reqUpdateCheck(tea)
        if (res.data.data.id) {
            message.success(msg)
        }
        this.props.hideModal()
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
        const { tea, index } = this.props
        let check = {}
        if (index === -1) {
        } else {
            if (Array.isArray(tea.check)) {
                check = tea.check[index] ? tea.check[index] : {}
            } else {
                tea.check = []
            }
        }
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.onFinish}
                initialValues={{
                    'typeId': check.typeId,
                    'date':check.date ? moment(check.date, 'YYYY-MM-DD') : "", 
                    'result':check.result, 
                    'finish': check.finish,
                }}>
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
                <Form.Item name="date" label="时间" rules={[{ required: true, message: '时间是必填的' }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item name="result" label="检测结果">
                    <Select
                        showSearch
                        placeholder="请选择检测结果"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {this.getOption('result')}
                    </Select>
                </Form.Item>
                <Form.Item name="finish" label="是否完成" rules={[{ required: true, message: '是否完成是必填的' }]}>
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