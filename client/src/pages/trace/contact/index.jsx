import React,{Component} from 'react'
import './index.less'
import { Input, Tabs ,Typography,Timeline} from 'antd';
import SearchTea from '../searchtea';
const { Search } = Input;
const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

const title = ["联系我们"]
export default class Contact extends Component{
    state = {
        text:title[0]
    }
    onChange = (activeKey) => {
        this.setState({
            text:title[activeKey-1]
        })
    }
    render(){
        return(
            <div className="about">
              <div className="about-top">
                <div className="about-top-left">
                    <h1>联系</h1>
                    <span>/</span>
                    <span>{this.state.text}</span>
                </div>
                <div className="about-top-right">
                    <SearchTea></SearchTea>
                </div>
              </div>
              <div className="about-center">
                <Tabs defaultActiveKey="1" tabPosition="left" onChange={this.onChange}>
                <TabPane tab={title[0]} key="1">
                <Typography style={{textIndent:"2em",marginTop:"10px"}}>
                    <Title>联系我们</Title>
                    <Paragraph>
                    电话： <Text strong>
                       8080888
                    </Text>
                    </Paragraph>
                    <Paragraph>
                    手机：
                    <Text strong>
                       1555555555
                    </Text>
                    </Paragraph>
                    <Paragraph>
                    QQ：
                    <Text strong>
                       160000000
                    </Text>
                    </Paragraph>
                   
                    <Paragraph>
                    邮箱：
                    <Text strong>
                       160000000@qq.com
                    </Text>
                    </Paragraph>
                    <Paragraph>
                    地址：
                    <Text strong>
                       湖南省长沙市岳麓区
                    </Text>
                    </Paragraph>
                </Typography>
                </TabPane>
                </Tabs>       
              </div>
            </div>
        )
    }
}