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
            if (area[item.id]) {
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
    UNSAFE_componentWillMount() {
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
        let place = this.props.value? this.props.value: this.props.place
        if(place){
            if(Array.isArray(place)){
                place = place
            }else{
                place = place.split('-')
            }
        }else{
            place = ""
        }
        return <Cascader
            options={this.state.options}
            onChange={this.onPlaceChange}
            placeholder="请选择地点"
            changeOnSelect
            value={place}
            showSearch={this.filter}
        />
    }
}
