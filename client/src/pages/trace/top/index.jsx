import React, { Component } from 'react'
import './index.less'
import { formateDate } from '../../../utils/dateUtils'
import { withRouter } from 'react-router-dom'
import { reqWeather } from '../../../api';
import logo from '../../../assets/GREEN_TEA.svg'
import { Row, Col } from 'antd';
import TopNav from "../top-nav";
import Info from '../../../components/info';
class Top extends Component {
    state = {
        currenTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: '',
        title: ''
    }
    getTime = () => {
        this.interval = setInterval(() => {
            const currenTime = formateDate(Date.now());
            this.setState({ currenTime })
        }, 1000)

    }
    getWeather = async () => {
        const { dayPictureUrl, weather } = await reqWeather('changsha')
        this.setState({ dayPictureUrl, weather })
    }
    /*
    第一次render()之后执行一次
    一般在此执行异步操作：发ajax请求/启动定时器
     */
    componentDidMount() {
        //获取当前时间
        this.getTime()
        //获取当前天气
        this.getWeather()
    }
    /*当前组件卸载之前调用 */
    componentWillUnmount() {
        //清除定时器
        clearInterval(this.interval)
    }
    render() {
        const { currenTime, dayPictureUrl, weather } = this.state;
        return (
            <div className="header">
                <Row gutter={16} className="header-top">
                    <Col span={8}>
                        <div style={{ display: 'flex' }}>
                            <img style={{ margin: "0 15px 0 15px", }} src={logo} alt="logo"></img>
                            <h1 style={{ color: '#2E8B57' }}>喝好茶</h1>
                            <h1 style={{ marginLeft: '20px' }}>中国茶叶专业追溯防伪平台</h1>
                        </div>
                    </Col>
                    <Col span={10} offset={6}>
                        <Row gutter={16} justify="end" style={{marginRight:"20px"}}>
                            <Col span={8}> <span>{currenTime}</span></Col>
                          
                            {weather ? (<Col > <img style={{ height: "25px" }} src={dayPictureUrl} alt='天气'></img> <span>{weather}</span></Col>) : ("")}
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