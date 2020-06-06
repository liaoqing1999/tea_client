import React, { Component } from 'react';
import { Select } from 'antd';
import { reqTeaType } from '../../api';
const { Option, OptGroup } = Select;
export default class TeaType extends Component {
    state = {
        typeTree: [],
    };
    componentDidMount = () => {
        this.getType()
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
    onChange = (value) =>{
        const { onChange } = this.props;
        onChange(value)
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
    render() {
        return (
            <Select
                showSearch
                placeholder="请选择类型"
                allowClear
                optionFilterProp="children"
                style={{width:"100%"}}
                value={this.props.value}
                onChange={this.onChange}
                filterOption={this.typeFilterOption}
            >
                {this.getTypeOption()}
            </Select>
        )
    }
}  