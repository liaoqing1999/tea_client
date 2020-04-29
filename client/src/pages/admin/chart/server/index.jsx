import React, { Component } from 'react'
import { Card, Row, Col, Descriptions, Table, Spin } from 'antd';
import { reqServer } from '../../../../api';
import sessionUtils from '../../../../utils/sessionUtils';
const columns = [
    {
        title: '盘符路径',
        dataIndex: 'dirName',
    },
    {
        title: '文件系统',
        dataIndex: 'sysTypeName',
    },
    {
        title: '盘符类型',
        dataIndex: 'typeName',
    },
    {
        title: '总大小',
        dataIndex: 'total',
    },
    {
        title: '可用大小',
        dataIndex: 'free',
    },
    {
        title: '已用大小',
        dataIndex: 'used',
    },
    {
        title: '已用百分比',
        dataIndex: 'usage',
        render: (text) =>
            <span style={{ color: text > 80 ? "red" : "black"}}>{text}%</span>
        ,
    }
]
export default class Server extends Component {
    state = {
        server: {}
    }
    getServer = async () => {
        const res = await reqServer()
        if (res.data.data.cpu) {
            const server = res.data.data
            sessionUtils.save("server",server)
            this.setState({ server })
        }
        
    }
    componentDidMount = () => {
        const server = sessionUtils.get("server")
        if(server){
            this.setState({ server })
        }else{
            this.getServer()
        }
    }
    render() {
        const { server } = this.state
        const { cpu, jvm, mem, sys, sysFiles } = server
        const spinning = cpu ? false : true
        return (
            <Spin tip="正在拼命加载中..." spinning={spinning}>
                <div style={{ width: "100%", minHeight: "400px" }}>
                    {cpu ? (
                        <div>
                            <Row gutter={30} justify="space-around">
                                <Col span={12}>
                                    <Card title="CPU" bordered={false} loading={spinning} hoverable bodyStyle={{ padding: "0px 0px 10px 0px" }}>
                                        <Descriptions column={1} bordered size="small">
                                            <Descriptions.Item span={2} label="属性">值</Descriptions.Item>
                                            <Descriptions.Item label="核心数">{cpu.cpuNum}</Descriptions.Item>
                                            <Descriptions.Item label="用户使用率">{cpu.used}%</Descriptions.Item>
                                            <Descriptions.Item label="系统使用率">{cpu.sys}%</Descriptions.Item>
                                            <Descriptions.Item label="当前空闲率">{cpu.free}%</Descriptions.Item>
                                        </Descriptions>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title="内存" hoverable bodyStyle={{ padding: "0px 0px 10px 0px" }} bordered={false} >
                                        <Descriptions column={3} bordered size="small">
                                            <Descriptions.Item span={2} label="属性">内存</Descriptions.Item><span>JVM</span>
                                            <Descriptions.Item span={2} label="总内存">{mem.total}G</Descriptions.Item>
                                            <span>{jvm.total}M</span>
                                            <Descriptions.Item span={2} label="已用内存">{mem.used}G</Descriptions.Item>
                                            <span>{jvm.used}M</span>
                                            <Descriptions.Item span={2} label="剩余内存">{mem.free}G</Descriptions.Item>
                                            <span>{jvm.free}M</span>
                                            <Descriptions.Item style={{ color: mem.usage > 80 ? "red" : "black" }} span={2} label="使用率">{mem.usage}%</Descriptions.Item>
                                            <span style={{ color: jvm.usage > 80 ? "red" : "black" }}>{jvm.usage}%</span>
                                        </Descriptions>
                                    </Card>
                                </Col>
                            </Row>
                            <Card style={{ marginTop: "10px" }} hoverable bodyStyle={{ padding: "0px 0px 10px 0px" }} title="服务器信息" bordered={false} >
                                <Descriptions column={2} bordered size="small">
                                    <Descriptions.Item label="服务器名称">{sys.computerName}</Descriptions.Item>
                                    <Descriptions.Item label="操作系统">{sys.osName}</Descriptions.Item>
                                    <Descriptions.Item label="服务器IP">{sys.computerIp}</Descriptions.Item>
                                    <Descriptions.Item label="系统架构">{sys.osArch}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                            <Card style={{ marginTop: "10px" }} hoverable bodyStyle={{ padding: "0px 0px 10px 0px" }} title="Java虚拟机信息" bordered={false}>
                                <Descriptions column={2} bordered size="small">
                                    <Descriptions.Item label="Java名称">{jvm.name}</Descriptions.Item>
                                    <Descriptions.Item label="Java版本">{jvm.version}</Descriptions.Item>
                                    <Descriptions.Item label="启动时间">{jvm.startTime}</Descriptions.Item>
                                    <Descriptions.Item label="运行时长">{jvm.runTime}</Descriptions.Item>
                                    <Descriptions.Item label="安装路径">{jvm.home}</Descriptions.Item>
                                    <Descriptions.Item label="项目路径">{sys.userDir}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                            <Card style={{ marginTop: "10px" }} hoverable bodyStyle={{ padding: "0px 0px 10px 0px" }} title="磁盘状态" bordered={false} >
                                <Table columns={columns}  rowKey="dirName" dataSource ={sysFiles}></Table>
                            </Card>
                        </div>
                    ) : ("")}

                </div>
            </Spin>

        )
    }
}