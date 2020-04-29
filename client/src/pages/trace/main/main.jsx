import React, { Component } from "react";
import {Redirect} from 'react-router-dom'
import { Layout} from 'antd';
import {Route,Switch} from 'react-router-dom'
import Top from "../top";
import banner1 from '../image/banner1.jpg'
import Bottom from "../bottom";
import Brand from "../brand";
import About from "../about";
import Contact from "../contact";
import Shop from "../shop";
import Join from "../join";
import News from "../news";
import Clause from "../clause";
import Union from "../union";
import Forum from "../forum";
import TeaResult from "../tearesult";
import UserInfo from "../info";
import OrgDetail from "../brand/detail";
import NewsDetail from "../news/detail";
const {  Content, Footer } = Layout;

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
              <div  style={{display:"flex",justifyContent: "center" ,padding: 24, minHeight: 450 }}>
                <Switch>
                    <Route path='/main/brand' exact component={Brand}></Route>
                    <Route path='/main/brand/detail' component={OrgDetail}></Route>
                    <Route path='/main/news'exact component={News}></Route>
                    <Route path='/main/news/detail' component={NewsDetail}></Route>
                    <Route path='/main/shop' component={Shop}></Route>
                    <Route path='/main/join' component={Join}></Route>
                    <Route path='/main/clause' component={Clause}></Route>
                    <Route path='/main/about' component={About}></Route>
                    <Route path='/main/contact' component={Contact}></Route>
                    <Route path='/main/union' component={Union}></Route>
                    <Route path='/main/forum' component={Forum}></Route>
                    <Route path='/main/result' component={TeaResult}></Route>
                    <Route path='/main/info' component={UserInfo}></Route>
                    <Redirect to = '/404' /> 
                </Switch>
                </div>
              </Content>
              <Footer style={{padding:"10px 0px",borderTop: "1px solid gray",backgroundColor:"white"}} ><Bottom></Bottom></Footer>
          </Layout>
        )
    }
}