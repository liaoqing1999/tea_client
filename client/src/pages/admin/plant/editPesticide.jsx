import React from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Select, Form, Input, Button, DatePicker, message } from 'antd'
import { reqUpdatePlant } from "../../../api";
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const { Option } = Select;
export default class EditPesticide extends React.Component {

    constructor(props) {
        super(props)
    }
    state = {
        tea: null
    }
    form = React.createRef();
    //接收父组件属性前
    componentWillReceiveProps(nextProps) {
        const { tea } = nextProps
        const pesticide = tea.index !== -1 ? tea.plant.pesticide[tea.index] : { date: new Date() }
        this.form.current.setFieldsValue({
            name: pesticide.name,
            date: moment(pesticide.date, 'YYYY-MM-DD'),
        });
    }
    onFinish = async (values) => {
        let pesticide = {}
        pesticide.name = values.name
        pesticide.date = new Date(values.date.valueOf())
        const tea = this.props.tea
        let msg = ""
        if(tea.index === -1){
            tea.plant.pesticide.push(pesticide)
            msg = "新增成功！"
        }else{
            tea.plant.pesticide[tea.index] = pesticide
            msg = "修改成功！"
        }
        const res = await reqUpdatePlant(tea)
        if(res.data.data.id){
            message.success(msg)
        }
        this.props.hideModal()
    }
    getOption = () => {
        const dict = this.props.dict
        let i=0
        return dict["pesticide"].reduce((pre, item) => {
            pre.push((
                <Option key={i} value={item.valueId}>{item.valueName}</Option>
            ))
            i++
            return pre
        }, [])
    }
    render() {
        const { tea } = this.props
        const pesticide = tea.index !== -1 ? tea.plant.pesticide[tea.index] : { date: new Date() }
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.onFinish}
                initialValues={{
                    'name': pesticide.name,
                    'date': moment(pesticide.date, 'YYYY-MM-DD'),
                }}>
                <Form.Item name="name" label="农药名" rules={[{ required: true, message: '农药名是必填的' }]}>
                    <Select
                        showSearch
                        placeholder="请选择农药"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                       {this.getOption()}
                    </Select>
                </Form.Item>
                <Form.Item name="date" label="施药时间">
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