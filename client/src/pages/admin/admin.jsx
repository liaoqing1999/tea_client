import React, { Component } from "react";
import memoryUtils from "../../utils/memoryUtils";
import {Redirect} from 'react-router-dom'
import { Layout} from 'antd';
import LeftNav from "../../components/left-nav";
import Top from "../../components/top";
import {Route,Switch} from 'react-router-dom'
import BookManage from "../bookManage/bookManage";
import BorrowManage from "../borrowManage/borrowManage";
import InfoManage from "../infoManage/infoManage";
import BookStore from "../chart/bookStore/bookStore";
import TypeStore from "../chart/typeStore/typeStore";
import ReaderNumber from "../chart/readerNumber/readerNumber";
import BorrowRatio from "../chart/borrowRatio/borrowRatio";
const {  Content, Footer, Sider } = Layout;

export default class Admin extends Component{
    state = {
        collapsed: false,
      };
    
      onCollapse = collapsed => {
        
        this.setState({ collapsed });
      };
    
    render(){
        const user = memoryUtils.user
      
        if(!user || !user.id){
            //自动跳转到登录
            return <Redirect to = '/login' />
        }
        return (
            <Layout >
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style ={{backgroundColor: '#002140'}}>
                <LeftNav collapsed={this.state.collapsed}></LeftNav>
            </Sider>
            <Layout>
          
              <Top></Top>
             
              <Content style={{margin:15,backgroundColor:'#fff',height:"80%"}}>
                <Switch>
                <Route path='/bookManage' component={BookManage}></Route>
                <Route path='/borrowManage' component={BorrowManage}></Route>
                <Route path='/infoManage' component={InfoManage}></Route>
                <Route path='/bookStore' component={BookStore}></Route>
                <Route path='/typeStore' component={TypeStore}></Route>
                <Route path='/readerNumber' component={ReaderNumber}></Route>
                <Route path='/borrowRatio' component={BorrowRatio}></Route>
                <Redirect to = '/bookManage' />
                </Switch>
              </Content>
              <Footer style={{textAlign:'center',color:'#aaaaaa'}}>科创信息 © 2013-2016</Footer>
            </Layout>
          </Layout>
  
        )
    }
}