import React, { Component } from 'react'
import { Card, Row, Col, Descriptions, Table ,Spin} from 'antd';
const columns = [
    {
        title: '盘符路径',
        dataIndex: 'dirName',
        key: 'dirName',
    },
    {
        title: '文件系统',
        dataIndex: 'sysTypeName',
        key: 'sysTypeName',
    },
    {
        title: '盘符类型',
        dataIndex: 'typeName',
        key: 'typeName',
    },
    {
        title: '总大小',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: '可用大小',
        dataIndex: 'free',
        key: 'free',
    },
    {
        title: '已用大小',
        dataIndex: 'used',
        key: 'used',
    },
    {
        title: '已用百分比',
        dataIndex: 'usage',
        key: 'usage',
    }
]
export default class Server extends Component {
    render() {
        return (
            <Spin tip="正在拼命加载中...">
                <div style={{ width: "100%" }}>
               
               <Row gutter={30} justify="space-around">
                   <Col span={12}>
                       <Card title="CPU" bordered={false} hoverable bodyStyle={{ padding: "0px 0px 10px 0px" }}>
                           <Descriptions column={1} bordered size="small">
                               <Descriptions.Item span={2} label="属性">值</Descriptions.Item>
                               <Descriptions.Item label="核心数">2</Descriptions.Item>
                               <Descriptions.Item label="用户使用率">0.5%</Descriptions.Item>
                               <Descriptions.Item label="系统使用率">0.5%</Descriptions.Item>
                               <Descriptions.Item label="当前空闲率">99%</Descriptions.Item>
                           </Descriptions>
                       </Card>
                   </Col>
                   <Col span={12}>
                       <Card title="内存" hoverable bodyStyle={{ padding: "0px 0px 10px 0px" }} bordered={false} >
                           <Descriptions column={3} bordered size="small">
                               <Descriptions.Item span={2} label="属性">内存</Descriptions.Item><span>JVM</span>
                               <Descriptions.Item span={2} label="总内存">7.64G</Descriptions.Item>
                               <span>505M</span>
                               <Descriptions.Item span={2} label="已用内存">3.14G</Descriptions.Item>
                               <span>125.49M</span>
                               <Descriptions.Item span={2} label="剩余内存">4.5G</Descriptions.Item>
                               <span>379.51M</span>
                               <Descriptions.Item span={2} label="使用率">41.14%</Descriptions.Item>
                               <span>24.85%</span>
                           </Descriptions>
                       </Card>
                   </Col>
               </Row>
               <Card style={{ marginTop: "10px" }} hoverable bodyStyle={{ padding: "0px 0px 10px 0px" }}  title="服务器信息" bordered={false} >
                   <Descriptions column={2} bordered size="small">
                       <Descriptions.Item  label="服务器名称">内存</Descriptions.Item>
                       <Descriptions.Item  label="操作系统">7.64G</Descriptions.Item>
                       <Descriptions.Item  label="服务器IP">172.18.233.53</Descriptions.Item>
                       <Descriptions.Item  label="系统架构">amd64</Descriptions.Item>
                   </Descriptions>
               </Card>
               <Card style={{ marginTop: "10px" }} hoverable bodyStyle={{ padding: "0px 0px 10px 0px" }} title="Java虚拟机信息" bordered={false}>
                   <Descriptions column={2} bordered size="small">
                       <Descriptions.Item  label="Java名称">Java HotSpot(TM) 64-Bit Server VM</Descriptions.Item>
                       <Descriptions.Item  label="Java版本">1.8.0_111</Descriptions.Item>
                       <Descriptions.Item  label="启动时间">2020-04-26 21:03:37</Descriptions.Item>
                       <Descriptions.Item  label="运行时长">2天18小时57分钟</Descriptions.Item>
                       <Descriptions.Item  label="安装路径">/usr/java/jdk1.8.0_111/jre</Descriptions.Item>
                       <Descriptions.Item  label="项目路径">/home/ruoyi/projects/ruoyi-vue</Descriptions.Item>
                   </Descriptions>
               </Card>
               <Card style={{ marginTop: "10px" }} hoverable bodyStyle={{ padding: "0px 0px 10px 0px" }} title="磁盘状态" bordered={false} >
                   <Table columns={columns}></Table>
               </Card>
           </div>   
            </Spin>
            
        )
    }
}