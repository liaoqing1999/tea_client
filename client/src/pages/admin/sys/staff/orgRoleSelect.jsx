import React, { Component } from "react";
import { Select } from "antd";
import { reqOrgAll, reqRoleAll } from "../../../../api";
const { Option } = Select;
class GetOrgSelect extends Component {
    state = {
        org: []
    }
    componentDidMount() {
        this.getOrg()
    }
    getOrg = async () => {
        const res = await reqOrgAll("2")
        if (res.data.data) {
            const org = res.data.data
            this.setState({ org })
        }
    }
    getOption = () => {
        const { org } = this.state
        if (Array.isArray(org)) {
            return org.reduce((pre, item) => {
                pre.push((
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                ))
                return pre
            }, [])
        }

    }
    onChange = (value) =>{
        const { onChange } = this.props;
        onChange(value)
    }
    render() {
        return <Select
            showSearch
            allowClear
            style={{width:"100%"}}
            placeholder="请选择机构"
            defaultValue={this.props.value}
            onChange={this.onChange}
            optionFilterProp="children"
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
            {this.getOption()}
        </Select>
    }
}
class GetRoleSelect extends Component {
    state = {
        role: []
    }
    componentDidMount() {
        this.getRole()
    }
    getRole = async () => {
        const res = await reqRoleAll()
        if (res.data.data) {
            const role = res.data.data
            this.setState({ role })
        }
    }
    getOption = () => {
        const { role } = this.state
        if (Array.isArray(role)) {
            return role.reduce((pre, item) => {
                pre.push((
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                ))
                return pre
            }, [])
        }
    }
    onChange = (value) =>{
        const { onChange } = this.props;
        onChange(value)
    }
    render() {
        return <Select
            showSearch
            allowClear
            style={{width:"100%"}}
            placeholder="请选择角色"
            defaultValue={this.props.value}
            onChange={this.onChange}
            optionFilterProp="children"
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
            {this.getOption()}
        </Select>
    }
}

export { GetOrgSelect, GetRoleSelect }