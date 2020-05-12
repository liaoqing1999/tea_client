
import React, { Component } from "react";
//import {Button, message} from 'antd'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";
import { Trace } from "./pages/trace";
import Main from "./pages/trace/main/main";
import Result404 from './components/result/404'
import Result403 from './components/result/403'
import Result500 from './components/result/500'
import "./config/config"
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { Register } from "./pages/login/register";
/*
应用的根组件
*/
export default class App extends Component {
    render() {
        return (
            <ConfigProvider locale={zhCN}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/' component={Trace}></Route>
                        <Route exact path='/login' component={Login}></Route>
                        <Route exact path='/register' component={Register}></Route>
                        <Route path='/admin' component={Admin}></Route>
                        <Route path='/main' component={Main}></Route>
                        <Route path='/404' component={Result404}></Route>
                        <Route path='/403' component={Result403}></Route>
                        <Route path='/500' component={Result500}></Route>
                        <Redirect to='/404' />
                    </Switch>
                </BrowserRouter>
            </ConfigProvider>

        )
    }
}