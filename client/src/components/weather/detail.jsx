import React, { Component } from 'react'
import sessionUtils from '../../utils/sessionUtils'
import { PageHeader, Row, Col, Button, message } from 'antd';
import './detail.less'
import moment from 'moment'
import rain from './image/rain.gif'
import snow from './image/snow.gif'
import cloud from './image/cloud.gif'
import wind from './image/wind.gif'
import { reqWeather } from '../../api';
export default class WeatherDetail extends Component {
    getWeather = async () => {
        let weatherList = await reqWeather('changsha')
        message.success("刷新成功")
        sessionUtils.save("weatherList", weatherList)
    }
    getWeathCard(list, color) {
        if (list && Array.isArray(list)) {
            return list.reduce((pre, item, index) => {
                pre.push((
                    <div key={index}>
                        <h3 style={{ color: color }}>{moment().add(index, 'days').date() + "日(" + item.date.slice(0, 2) + ")"}</h3>
                        <h1 style={{ color: color }}>
                            <img src={item.dayPictureUrl}></img>/
                            <img src={item.nightPictureUrl}></img>
                        </h1>
                        <h3 style={{ color: color }}>{item.weather}</h3>
                        <h3 style={{ color: color }}>{item.temperature}</h3>
                        <h3 style={{ color: color }}>{item.wind}</h3>
                    </div>
                ))
                return pre
            }, [])
        }
    }
    getDetailCard(list, color) {
        if (list && Array.isArray(list)) {
            return list.reduce((pre, item, index) => {
                pre.push((
                    <Col key={index} span={4} style={{ margin: "0 15px 15px 15px" }}>
                        <h2 style={{ color: color, textAlign: "left" }}>{item.title}</h2>
                        <h3 style={{ color: color, textAlign: "left" }}>
                            {item.tipt}:{item.zs}
                        </h3>
                        <h3 style={{ color: color, textAlign: "left" }}>{item.des}</h3>
                    </Col>
                ))
                return pre
            }, [])
        }
    }
    render() {
        const weatherList = sessionUtils.get("weatherList");
        if (weatherList && weatherList.results[0]) {

        } else {
            this.props.history.goBack()
        }
        const result = weatherList.results[0]
        const data = result.weather_data[0]
        let bg = wind
        let color = "black"
        if (data.weather.indexOf('雪') !== -1) {
            bg = snow
            color = "#800080"
        } else if (data.weather.indexOf('雨') !== -1) {
            bg = rain
            color = "#FFF8DC"
        } else if (data.weather.indexOf('云') !== -1) {
            bg = cloud
            color = "#000000"
        } else if (data.weather.indexOf('风') !== -1) {
            bg = wind
            color = "#4682B4"
        }
        const title = (
            <h1>
                <span>天气详情</span>/
                <Button type="link" style={{ color: "black", padding: "5px" }} onClick={() => this.getWeather()}>刷新</Button>
            </h1>
        )
        return (
            <div style={{ width: "100%", minHeight: "456px", backgroundImage: `url(${bg})`, backgroundSize: '100% 100%' }}>
                <PageHeader
                    className="site-page-header"
                    onBack={() => this.props.history.goBack()}
                    title={title}
                />
                <div className="detail">
                    <h2 style={{ color: color }}>湖南省长沙市</h2>

                    <h1 style={{ color: color }}>
                        <img src={data.dayPictureUrl}></img>
                        <span>{data.date}</span>
                    </h1>
                    <h3 style={{ color: color }}>{data.weather}</h3>
                    <h3 style={{ color: color }}>{data.temperature}<span style={{ margin: "0 15px" }}>pm25:{result.pm25}</span></h3>
                    <h3 style={{ color: color }}>{data.wind}</h3>

                    <h2 style={{ color: color, textAlign: "left", margin: "20px 15px" }}>天气趋势</h2>
                    <Row justify="space-between">
                        {this.getWeathCard(result.weather_data, color)}
                    </Row>

                    <h2 style={{ color: color, textAlign: "left", margin: "20px 15px" }}>今日详情</h2>
                    <Row justify="space-between">
                        {this.getDetailCard(result.index, color)}
                    </Row>
                </div>
            </div>
        )
    }
}