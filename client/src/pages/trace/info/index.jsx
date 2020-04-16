import React, { Component } from 'react'
import SearchTea from '../searchtea';
import { Menu, Col, Row } from 'antd';
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import User from '../../../components/info/user';
import Msg from '../../../components/info/msg';
import UserPassword from '../../../components/info/password';
import memoryUtils from '../../../utils/memoryUtils';
export default class UserInfo extends Component {
    render() {
        const path = this.props.location.pathname
        const u = memoryUtils.user
        if (!u || !u.id) {
            //自动跳转到登录
            return <Redirect to='/login' />
        }
        console.log(this.props)
        return (
            <div className="about">
                <div className="about-top">
                    <div className="about-top-left">
                        <h1>个人信息</h1>
                        <span>/</span>
                        <span>111</span>
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
                                <Menu.Item key="/main/info/user">
                                    <Link to='/main/info/user'>
                                        <span>基本资料</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="/main/info/msg">
                                    <Link to='/main/info/msg'>
                                        <span>消息中心</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="/main/info/password">
                                    <Link to='/main/info/password'>
                                        <span>修改密码</span>
                                    </Link>
                                </Menu.Item>
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

                    <div >

                    </div>
                </div>
            </div>
        )
    }
}