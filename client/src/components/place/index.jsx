import React, { Component } from 'react'
import { Cascader } from 'antd';
import province from './province';
import city from './city';
import area from './area';
const options = province;
export default class Place extends Component {
    state = {
        options,
    };
   
    getProvince = (province) => {
        return province.map(item => {
            item.label = item.name
            item.value = item.name
            item.isLeaf = false
            if (city[item.id]) {
                item.children = this.getCity(city[item.id])
            }
            return item
        })
    }
    getCity = (city) => {
        return city.map(item => {
            item.label = item.name
            item.value = item.name
            item.isLeaf = false
            if(area[item.id]){
                item.children = this.getArea(area[item.id])
            }
           
            return item
        })
    }
    getArea = (area) => {
        return area.map(item => {
            item.label = item.name
            item.value = item.name
            return item
        })
    }
    componentWillMount() {
        this.getProvince(options);
    }
    onPlaceChange = (value, selectedOptions) => {
        const { onChange } = this.props;
        onChange(value)
    }
    filter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }
    render() {
        return <Cascader
            options={this.state.options}
            onChange={this.onPlaceChange}
            placeholder="Please select"
            changeOnSelect
            showSearch={this.filter}
        />
    }
}
