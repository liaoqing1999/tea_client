import React, { Component } from "react";
import './index.less';
import logo from '../../assets/GREEN_TEA.svg'
import banner1 from './image/banner1.jpg'
import banner2 from './image/banner2.jpg'
import SearchTea from "./searchtea";
export class Trace extends Component{
    state = {
        bg : banner1,
        setBg :false,
    
        width:"100%",
        height:"100%"
    }
    componentDidMount = () => {
        this.setState({width:document.body.clientWidth,height: document.body.clientHeight})
        //动态修改背景
        this.setBg();
      };
    setBg = () =>{
        this.interval = setInterval(()=>{
            let bg ;
          if(this.state.setBg){
            bg = banner1;
          }else{
            bg = banner2;
          }
          this.setState({
            bg:bg,
            setBg:!this.state.setBg
          })
        },7000)
    }
   
    render(){
     
        return (
            <div className="main" style ={{height:this.state.height, width:this.state.width,backgroundImage: `url(${this.state.bg})`,backgroundSize:'100% 100%'}}>
                <div className="main-top">
                    <img src={logo} alt="logo"></img>
                    <h1 style = {{color:'#2E8B57',lineHeight:"20px"}}>喝好茶</h1>
                    <h1  style = {{fontSize:'40px',marginLeft:'70px'}}>中国茶叶专业追溯防伪平台</h1>
                </div>
                <div className="main-search">
                    <h1>茶类质量安全溯源</h1>
                    <SearchTea></SearchTea>
                    <h2>生产有规程、质量有标准、安全可追溯</h2>
                </div>
                <div className="main-cnav">
                    <div className="main-cnav-item"><a href="/main/brand">品牌</a></div>
                    <div className="main-cnav-item"><a href="/main/news">资讯</a></div>
                    <div className="main-cnav-item"><a href="/main/shop">商城</a></div>
                    <div className="main-cnav-item"><a href="/main/about">关于</a></div>
                </div>
            </div>
        )
    }
}

export default Trace

/*
async和await
1.作用
简化promise对象的使用，消灭了then，不用在使用then（）来指定成功/失败的回调函数
以异步编码方式实现异步流程

2.哪里写await
在返回promise的表达式左侧写await：不想要promise，想要promise异步执行成功的value数据

3.哪里写async
await所在函数（最近的）定义的左侧写async
*/