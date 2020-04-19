import React, { Component } from "react";
import memoryUtils from "../../utils/memoryUtils";
import { Redirect } from 'react-router-dom'
import { Layout} from 'antd';
import './index.less';
import LeftNav from "./left-nav";
import Top from "./top";
import { Route, Switch,withRouter } from 'react-router-dom'
import User from '../../components/info/user'
import Msg from "../../components/info/msg";
import UserPassword from "../../components/info/password";
import Plant from "./plant";
import Process from "./process";
import Storage from "./storage";
import Check from "./check";
import Sale from "./sale";
import Org from "./org";
import Staff from "./staff";
import Role from "./role";
import Result404 from '../../components/result/404'
import Result403 from '../../components/result/403'
import Result500 from '../../components/result/500'
import { routeList } from "../../config/menuConfig";
const { Content, Footer, Sider } = Layout;
class Admin extends Component {
  state = {
    collapsed: false,
  };
  componentWillReceiveProps(nextprops){
    this.role(nextprops)
  }
  role(props){
    const pathname = props.location.pathname
    const role = memoryUtils.role
    if(role.name==="superAdmin"){

    }else{
      if(routeList.indexOf(pathname)!==-1&&role.menu.indexOf(pathname)===-1&&pathname!=='/admin/403'){
        this.props.history.replace('/admin/403')
      }
    }
   
  }
  componentWillMount(){
    this.role(this.props)
  }
  onCollapse = collapsed => {

    this.setState({ collapsed });
  };

  render() {
    const u = memoryUtils.user
    const role = memoryUtils.role
    if(role.name==="user"){
      return <Redirect to='/403' />
    }
    if (!u || !u.id) {
      //自动跳转到登录
      return <Redirect to='/login' />
    }
    return (
      <div>
        <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{ backgroundColor: '#002140' }}>
            <LeftNav collapsed={this.state.collapsed}></LeftNav>
          </Sider>
          <Layout className="site-layout">
            
            <Top></Top>
            
            <Content >
            <div className="site-layout-background" style={{ padding: 30 }}>
              <div style={{backgroundColor:"white",padding: 24, minHeight: 480}}>
              <Switch>
                <Route path='/admin/info/user' component={User}></Route>
                <Route path='/admin/info/msg' component={Msg}></Route>
                <Route path='/admin/info/password' component={UserPassword}></Route>
                <Route path='/admin/plant' component={Plant}></Route>
                <Route path='/admin/process' component={Process}></Route>
                <Route path='/admin/storage' component={Storage}></Route>
                <Route path='/admin/check' component={Check}></Route>
                <Route path='/admin/sale' component={Sale}></Route>
                <Route path='/admin/org' component={Org}></Route>
                <Route path='/admin/staff' component={Staff}></Route>
                <Route path='/admin/role' component={Role}></Route>
                <Route path='/admin/404' component={Result404}></Route>
                <Route path='/admin/403' component={Result403}></Route>
                <Route path='/admin/500' component={Result500}></Route>
                <Redirect to = '/admin/404' /> 
              </Switch>
              </div>
           
              </div>
            </Content>
            <Footer style={{ textAlign: 'center', color: '#aaaaaa' }}>喝好茶 © 2019-2020 廖青毕业设计作品</Footer>
          </Layout>
        </Layout>
        
      </div>
    )
  }
}

export default withRouter(Admin)