import React, { Component } from "react";
import { Select, Form, Button, Input, message } from 'antd'
import { reqUpdateTea, reqOrgRoleStaff } from "../../../../api";

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
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
export default class SetTea extends Component {
    state = {
        tea: {},
        staffId: ""
    }
    form = React.createRef();
    constructor(props) {
        super(props)
        const { tea, setType, index, produce } = props
        let staffId = ""
        if (setType === 'plant') {
            tea.plant = tea.plant ? tea.plant : {}
            staffId = tea.plant.planter
        } else if (setType === 'process') {
            tea.process = tea.process && Array.isArray(tea.process) ? tea.process : []
            if (index >= 0) {
                staffId = tea.process[index].processer
            }
        } else if (setType === 'storage') {
            tea.storage = tea.storage ? tea.storage : {}
            staffId = tea.storage.storageer
        } else if (setType === 'check') {
            tea.check = tea.check && Array.isArray(tea.check) ? tea.check : []
            if (index >= 0) {
                staffId = tea.check[index].checker
            }
        }
        this.getData(produce.org, setType)
        this.state = { tea, staffId }
    }

    getData = async (org, role) => {
        const res = await reqOrgRoleStaff(org, role)
        if (res.data.data) {
            this.setState({ staffList: res.data.data })
        }
    }
    //接收父组件属性前
    componentWillReceiveProps(nextProps) {
        const { tea, setType, index, produce } = nextProps
        if (tea !== this.props.tea || setType !== this.props.setType || index !== this.props.index) {
            let staffId = ""
            if (setType === 'plant') {
                tea.plant = tea.plant ? tea.plant : {}
                staffId = tea.plant.planter
            } else if (setType === 'process') {
                tea.process = tea.process && Array.isArray(tea.process) ? tea.process : []
                if (index && index >= 0) {
                    staffId = tea.process[index].processer
                }
            } else if (setType === 'storage') {
                tea.storage = tea.storage ? tea.storage : {}
                staffId = tea.storage.storageer
            } else if (setType === 'check') {
                tea.check = tea.check && Array.isArray(tea.check) ? tea.check : []
                if (index && index >= 0) {
                    staffId = tea.check[index].checker
                }
            }
            this.getData(produce.org, setType)
            this.form.current.setFieldsValue({
                'name': tea.name,
                "batch": tea.batch,
                "staffId": staffId
            });
            this.setState({ tea })
        }
    }
    onFinish = async (values) => {
        const { tea } = this.state
        const { setType, index } = this.props
        if (setType === 'plant') {
            tea.plant.planter = values.staffId
        } else if (setType === 'process') {
            if (index >= 0) {
                tea.process[index].processer = values.staffId
            } else {
                tea.process.push({ processer: values.staffId })
            }

        } else if (setType === 'storage') {
            tea.storage.storageer = values.staffId
        } else if (setType === 'check') {
            if (index >= 0) {
                tea.check[index].checker = values.staffId
            } else {
                tea.check.push({ checker: values.staffId })
            }
        }
        const res = await reqUpdateTea(tea)
        if (res.data.data) {
            message.success("设置成功")
            this.props.hideModal()
        }
    }
    getOption = (name) => {
        const { staffList } = this.state
        if (staffList && Array.isArray(staffList)) {
            return staffList.reduce((pre, item) => {
                pre.push((
                    <Option key={item.id} value={item.valueId}>{item.name}--{item.realName}</Option>
                ))
                return pre
            }, [])
        }

    }
    filterOption = (input, option) => {
        if (option.children) {
            return option.children.join("").toLowerCase().indexOf(input.toLowerCase()) >= 0
        } else {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
    }
    render() {
        const { tea, staffId } = this.state
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.onFinish} validateMessages={validateMessages}
                initialValues={{
                    'name': tea.name,
                    "batch": tea.batch,
                    "staffId": staffId
                }}>
                <Form.Item name='name' label="茶叶名" >
                    <Input disabled />
                </Form.Item>
                <Form.Item name='batch' label="批次">
                    <Input disabled />
                </Form.Item>
                <Form.Item name='staffId' label="员工">
                    <Select
                        showSearch
                        placeholder="请选择等级"
                        optionFilterProp="children"
                        filterOption={this.filterOption}
                    >
                        {this.getOption()}
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
                    <Button type="primary" htmlType="submit">提交 </Button>
                    <Button type="link" onClick={this.props.hideModal}>取消</Button>
                </Form.Item>
            </Form>
        </div>)
    }
}