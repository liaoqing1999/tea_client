import React, { Component } from "react";
import {Redirect} from 'react-router-dom'
import { Layout} from 'antd';
import {Route,Switch} from 'react-router-dom'
import Top from "../top";
import banner1 from '../image/banner1.jpg'
import Bottom from "../bottom";
import Trace from "..";
import Brand from "../brand";
import About from "../about";
import Contact from "../contact";

const {  Content, Footer, Sider } = Layout;

export default class Main extends Component{
    state = {
        collapsed: false,
        width:"100%",
        height:"100%"
      };
      componentDidMount = async () => {
        this.setState({width:document.body.clientWidth,height: document.body.clientHeight})
      }
      onCollapse = collapsed => {
        
        this.setState({ collapsed });
      };
    /**/
    render(){
        return (
            <Layout >
           
               <Top></Top>
              <Content style={{padding:"1.5% 5%",backgroundImage: `url(${banner1})`,backgroundSize:'100% 100%'}}>
               
                <Switch>
                    <Route path='/main/brand' component={Brand}></Route>
                    <Route path='/main/news' component={Trace}></Route>
                    <Route path='/main/shop' component={Trace}></Route>
                    <Route path='/main/jion' component={Trace}></Route>
                    <Route path='/main/clause' component={Trace}></Route>
                    <Route path='/main/about' component={About}></Route>
                    <Route path='/main/contact' component={Contact}></Route>
                    <Route path='/main/union' component={Trace}></Route>
                    <Route path='/main/forum' component={Trace}></Route>
                    <Redirect to = '/main/brand' /> 
                </Switch>
              </Content>
              <Footer style={{padding:"10px 0px",borderTop: "1px solid gray",backgroundColor:"white"}} ><Bottom></Bottom></Footer>
          </Layout>
        )
    }
}