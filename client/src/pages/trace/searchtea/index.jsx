import React,{Component} from 'react'
import { Input} from 'antd';
const { Search } = Input;
export default class SearchTea extends Component{
    render(){
        return(
            <Search
            placeholder="请输入溯源码查询"
            size ="large"
            onSearch={value => console.log(value)}
            style={{ width: 300 }}
            />
        )
    }
}