import React from "react";
import { Select, Form, Input, Button } from 'antd'
import { reqTeaType,reqOrgProduce } from "../../../../api";
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
const { Option, OptGroup } = Select;
export default class AddTea extends React.Component {
    state = {
        tea: null
    }
    form = React.createRef();
    onFinish = async (values) => {
       this.props.addTea(values)
       this.props.hideModal()
    }
    componentDidMount = () => {
        const user = memoryUtils.user
        this.getType()
        this.getProduce(user.org)
    }
    getProduceOption = () =>{
        const { produce } = this.state
        if (Array.isArray(produce)) {
            return produce.reduce((pre, item) => {
                pre.push((
                    <Option key={item.id} type={item.typeId} value={item.id}>{item.name}</Option>
                ))
                return pre
            }, [])
        }
    }
    getProduce =async (org) => {
        const res = await reqOrgProduce(org)
        if(res.data.data){
            const produce  = res.data.data
            this.setState({produce})
        }
    }
    onChange = (value, option) =>{
        this.form.current.setFieldsValue({
            typeId: option.type
        });
    }
    getTypeOption = () => {
        const { typeTree } = this.state
        if (Array.isArray(typeTree)) {
            return typeTree.reduce((pre, item) => {
                if (Array.isArray(item.children) && item.children.length > 0) {
                    pre.push((
                        <OptGroup label={item.label} key={item.value}>
                            {
                                item.children.reduce((p, i) => {
                                    p.push((
                                        <Option key={i.value} value={i.value}>{i.label}</Option>
                                    ))
                                    return p
                                }, [])
                            }
                        </OptGroup>
                    ))
                }
                return pre
            }, [])
        }
    }
    getType = async () => {
        const res = await reqTeaType()
        if (res.data.data) {
            const typeTree = res.data.data
            this.setState({ typeTree })
        }
    }
    typeFilterOption = (input, option) =>{
        if(option.children){
            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }else{
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
    }
    render() {
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.onFinish} validateMessages={validateMessages}>
                <Form.Item name="name" label="茶叶名" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="typeId" label="茶叶类型" rules={[{ required: true }]}>
                    <Select
                        showSearch
                        placeholder="请选择所属产品"
                        optionFilterProp="children"
                        filterOption={this.typeFilterOption}
                    >
                        {this.getTypeOption()}
                    </Select>
                </Form.Item>
                <Form.Item name="batch" label="茶叶批次" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="produce" label="所属产品" rules={[{ required: true }]}>
                    <Select
                        showSearch
                        placeholder="请选择所属产品"
                        optionFilterProp="children"
                        onChange={this.onChange}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {this.getProduceOption()}
                    </Select>
                </Form.Item>
                <Form.Item name= {['plant', 'place']} label="产地" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
               
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">提交 </Button>
                    <Button type="link" onClick={this.props.hideModal}>取消</Button>
                </Form.Item>
            </Form>
        </div>)
    }
}