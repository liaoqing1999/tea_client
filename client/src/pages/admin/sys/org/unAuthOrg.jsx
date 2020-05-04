import React from "react";
import { Table, Descriptions, Button, Carousel, Modal, Row, Popconfirm, Divider, message } from 'antd'
import { reqOrgPage,reqOrgAuth } from "../../../../api";
export default class UnAuthOrg extends React.Component {
    state = {
        org: {},
        img: [],
        visible: false,
    }
    getOrg = async (page, rows) => {
        const res = await reqOrgPage(page, rows, "", "1")
        const org = res.data.data
        this.setState({ org })
    }
    expandedRowRender = (record) => {
        return (
            <Descriptions column={2} >
                <Descriptions.Item span={2} label="描述">{record.description}</Descriptions.Item>
                <Descriptions.Item label="备注">{record.remark}</Descriptions.Item>
                <Descriptions.Item label="机构图标"> <Button style={{ padding: "0" }} type="link" onClick={() => this.setState({ visible: true, img: record.trademark })}>查看详情</Button></Descriptions.Item>
                <Descriptions.Item label="营业执照"> <Button style={{ padding: "0" }} type="link" onClick={() => this.setState({ visible: true, img: record.permit })}>查看详情</Button></Descriptions.Item>
                <Descriptions.Item label="组织机构代码证"> <Button style={{ padding: "0" }} type="link" onClick={() => this.setState({ visible: true, img: record.codePermit })}>查看详情</Button></Descriptions.Item>
            </Descriptions>
        );
    };
    getCarousel(img) {
        if (Array.isArray(img)) {
            let i = 0
            return img.reduce((pre, item) => {
                pre.push((
                    <div key={i++}>
                        <img alt="img" style={{ width: "470px", height: "300px" }} src={global.ipfs.uri + item}></img>
                    </div>
                ))
                return pre
            }, [])
        } else {
            return <div><img alt="img" src={global.ipfs.uri + img}></img> </div>
        }
    }
    oper =async (id,state) =>{
       const res =  await reqOrgAuth(id,state)
       if(res.data.data){
           message.success("审核成功！")
           this.getOrg(1,3)
       }
    }
   
    componentDidMount = () => {
        this.getOrg(1, 3)
    }
    render() {
        const { org, visible, img } = this.state
        const columns = [
            { title: '机构名', dataIndex: 'name', key: 'name' },
            { title: '法人', dataIndex: 'corporation', key: 'corporation' },
            { title: '邮箱', dataIndex: 'email', key: 'email' },
            { title: '生产许可证编号', dataIndex: 'license', key: 'license' },
            { title: '联系电话', dataIndex: 'phone', key: 'phone' },
            { title: '地点', dataIndex: 'place', key: 'place' },
            {
                title: '操作', dataIndex: 'operation',width:180, key: 'operation', render: (text, record) =>
                    <Row>
                        <Button size="middle" type="primary" onClick={() => this.oper(record.id,"2")}>通过</Button>
                        <Divider type="vertical"></Divider>
                        <Popconfirm title="确定要拒绝吗?" onConfirm={() => this.oper(record.id,"0")}>
                            <Button size="middle" type="danger">拒绝</Button>
                        </Popconfirm>
                    </Row>
            },
        ];
        const paginationProps = {
            showQuickJumper: true,
            showTotal: () => `共${org.total}条`,
            total: org.total,
            pageSize: 3,
            onChange: (current) => this.getOrg(current, 3),
        };
        return (
            <div>
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    rowKey="id"
                    expandable={{ expandedRowRender: this.expandedRowRender }}
                    pagination={paginationProps}
                    dataSource={org.content}
                />
                <Modal
                    title="详情图"
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                    footer={[
                        <Button key="back" onClick={() => this.setState({ visible: false })}>
                            确认
                        </Button>
                    ]}
                    bodyStyle={{ backgroundColor: "white" }}
                >   <Carousel style={{ backgroundColor: "white" }} autoplay>
                        {this.getCarousel(img)}
                    </Carousel>
                </Modal>
            </div>
        )
    }
}