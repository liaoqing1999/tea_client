import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import {  Menu, Dropdown, Modal, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined,MessageOutlined} from '@ant-design/icons';
class Info extends Component {
    logout = () => {
        Modal.confirm({
            title: '确认退出登录吗?',
            content: '这可能会导致某些数据未保存',
            onOk: () => {
                storageUtils.removeUser();
                memoryUtils.user = {};
                this.props.history.replace('/login')
            },
            onCancel() {

            },
        })
    }
    login = () => {
        this.props.history.replace('/login')
    }
    render() {
        const user = memoryUtils.user
        const menu = (
            <Menu >
                <Menu.Item key="1"> <Link to="/"><UserOutlined style={{marginRight:"10px"}} />个人中心</Link></Menu.Item>
                <Menu.Item key="2"> <Link to="/"><MessageOutlined style={{marginRight:"10px"}}/>消息提醒</Link></Menu.Item>
                <Menu.Item key="3" onClick ={this.logout}><LogoutOutlined style={{marginRight:"10px"}} />退出登录</Menu.Item>
            </Menu>
        );
        return <div >
            {
                user.id ? (<Dropdown overlay={menu}>
                    <div style={{ display: "flex" }}>
                        {
                            user.img ? (<Avatar size={30}style={{ marginTop: "5px" }} src={global.ipfs.uri + user.img} />)
                                : (<Avatar size={30} style={{ marginTop: "5px", backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                )
                        }
                        <span>{user.name}</span></div>
                </Dropdown>) : (<Button type="primary" size='small' onClick={this.login}>登录</Button>)
            }

        </div>
    }
}

export default withRouter(Info)