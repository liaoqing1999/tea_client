import React,{Component} from 'react'
import './index.less'
import {Tabs} from 'antd';
import SearchTea from '../searchtea';
import { trace } from '../../../assets/data';
const { about } = trace;
const { TabPane } = Tabs;

const title = about.title;
export default class About extends Component{
    state = {
        text:title[0]
    }
    onChange = (activeKey) => {
        this.setState({
            text:title[activeKey-1]
        })
    }
     /*使用reduce()+递归调用 */
     getContent = (title) =>{
        let i=1;
       return title.reduce((pre,item)=>{
            pre.push((
                <TabPane tab={item} key={i}>
                    {about.content[i-1]}
                </TabPane>
            ))
            i++
           return pre
       },[])
    }
    componentWillMount(){
        this.content =  this.getContent(title);
    }
    render(){
        return(
            <div className="about">
              <div className="about-top">
                <div className="about-top-left">
                    <h1>{about.mainTitle}</h1>
                    <span>/</span>
                    <span>{this.state.text}</span>
                </div>
                <div className="about-top-right">
                    <SearchTea></SearchTea>
                </div>
              </div>
              <div className="about-center">
                <Tabs defaultActiveKey="1" tabPosition="left" onChange={this.onChange}>
                    { this.content}
                </Tabs>       
              </div>
            </div>
        )
    }
}