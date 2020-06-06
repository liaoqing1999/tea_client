import React, { Component } from 'react'
import './index.less'
import { withRouter } from 'react-router-dom'
import logo from '../../../assets/GREEN_TEA.svg'
import { Row, Col } from 'antd';
import TopNav from "../top-nav";
import Info from '../../../components/info';
import NowTime from '../../../components/calendar';
import Weather from '../../../components/weather';
class Top extends Component {
    render() {
        return (
            <div className="header">
                <Row gutter={16} className="header-top">
                    <Col span={8}>
                        <div style={{ display: 'flex' }}>
                            <img style={{ margin: "0 15px 0 15px",width:"40px",height:"40px" }} src={logo} alt="logo"></img>
                            <h1 style={{ color: '#2E8B57' }}>喝好茶</h1>
                            <h1 style={{ marginLeft: '20px' }}>中国茶叶专业追溯防伪平台</h1>
                        </div>
                    </Col>
                    <Col span={10} offset={6} >
                        <Row gutter={16} justify="end" style={{ marginRight: "20px" }}>
                            <NowTime></NowTime>
                            <Weather ></Weather>
                            <Info></Info>
                        </Row>
                    </Col>
                </Row>
                <Row justify="space-between" align="middle" >
                    <Col offset={2} span={8}>
                        <h2 style={{ fontSize: '15px' }}>生产有规程、质量有标准、安全可追溯</h2>
                    </Col>
                    <div className="header-bottom-right">
                        <TopNav></TopNav>
                    </div>
                </Row>
            </div>
        )
    }
}

export default withRouter(Top)