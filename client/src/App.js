
import React, { Component } from "react";
//import {Button, message} from 'antd'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";
import { Trace } from "./pages/trace";
import Main from "./pages/trace/main/main";
import "./config/config"
/*
应用的根组件
*/
export default class App extends Component{
    render(){
        return (
            <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Trace}></Route>
                <Route exact path='/login' component={Login}></Route>
                <Route path='/admin' component={Admin}></Route>
                <Route path='/main' component={Main}></Route>
            </Switch>
            </BrowserRouter>
        )
    }
}