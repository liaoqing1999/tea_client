import React, { Component } from 'react'
import SearchTea from '../searchtea';
import { Menu, Col, Row } from 'antd';
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import User from '../../../components/info/user';
import Msg from '../../../components/info/msg';
import UserPassword from '../../../components/info/password';
import memoryUtils from '../../../utils/memoryUtils';
const menuTitle = [
    {
        key: '/main/info/user',
        title: '基本资料'
    },
    {
        key: '/main/info/msg',
        title: '消息中心'
    },
    {
        key: '/main/info/password',
        title: '修改密码'
    }
]
export default class UserInfo extends Component {
    /*使用reduce()+递归调用 */
    getMenuNodes_r = (menuList) => {
        //得到当前路由路径
        return menuList.reduce((pre, item) => {
            pre.push((
                <Menu.Item key={item.key}>
                    <Link to={item.key}>
                        <span>{item.title}</span>
                    </Link>
                </Menu.Item>
            ))
            return pre
        }, [])
    }
    //第一次render()之前执行一次
    //为第一个render()准备数据（必须同步）
    componentWillMount() {
        this.menuNodes = this.getMenuNodes_r(menuTitle);
    }
    render() {
        const path = this.props.location.pathname
        const item=menuTitle.find(item => item.key===path)
        const u = memoryUtils.user
        if (!u || !u.id) {
            //自动跳转到登录
            return <Redirect to='/login' />
        }
        return (
            <div className="about">
                <div className="about-top">
                    <div className="about-top-left">
                        <h1>个人信息</h1>
                        <span>/</span>
                        <span>{item.title}</span>
                    </div>
                    <div className="about-top-right">
                        <SearchTea></SearchTea>
                    </div>
                </div>

                <div className="about-center">
                    <Row>
                        <Col span={3}>
                            <Menu
                                mode="inline"
                                selectedKeys={[path]}
                                style={{ width: 100 }}
                            >
                                {
                                    this.menuNodes
                                }
                            </Menu>
                        </Col>
                        <Col span={20} style={{ padding: 24 }}>
                            <Switch >
                                <Route path='/main/info/user' component={User}></Route>
                                <Route path='/main/info/msg' component={Msg}></Route>
                                <Route path='/main/info/password' component={UserPassword}></Route>
                            </Switch>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}