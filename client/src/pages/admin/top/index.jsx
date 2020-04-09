import React, { Component } from 'react'
import './index.less'
import { formateDate } from '../../../utils/dateUtils'
import { withRouter,Link } from 'react-router-dom'
import { reqWeather } from '../../../api';
import { menuList } from '../../../config/menuConfig';
import Info from '../../../components/info';
import { Row, Col } from 'antd';
class Top extends Component {

    state = {
        currenTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: '',
        title: '',
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
    //获取标题中的递归函数
    getTitleForEach = (list, path) => {
        let title
        list.forEach(item => {
            if (item.key === path) {
                title = item.title;
            } else if (item.children) {
                const t = this.getTitleForEach(item.children, path)
                if (t) title = t;
            }

        })
        return title;
    }
    //获取标题
    getTitle = () => {
        const path = this.props.location.pathname;
        const title = this.getTitleForEach(menuList, path)
        console.log(path, title)
        return title;
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
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <Row justify="end">
                        <Col span={3}><Info></Info></Col>
                    </Row>  
                </div>
                <div className='header-bottom'>
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{currenTime}</span>
                        <img src={dayPictureUrl} alt='天气'></img>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Top)