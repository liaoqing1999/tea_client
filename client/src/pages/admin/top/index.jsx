import React, { Component } from 'react'
import './index.less'
import { withRouter } from 'react-router-dom'
import { menuList } from '../../../config/menuConfig';
import Info from '../../../components/info';
import { Row, Col} from 'antd';
import NowTime from '../../../components/calendar'
import Weather from '../../../components/weather';
class Top extends Component {
    state = {
        title: '',
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
        return title;
    }
 
    render() {
        
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
                        <NowTime></NowTime>
                        <Weather></Weather>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Top)