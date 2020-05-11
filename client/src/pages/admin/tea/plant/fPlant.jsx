import React from "react";
import { FileImageTwoTone } from '@ant-design/icons';
import { Table, Descriptions, Button, Carousel, Modal, Row, Col } from 'antd'
import { reqGetPlant } from "../../../../api";
import memoryUtils from "../../../../utils/memoryUtils";
export default class FPlant extends React.Component {
    state = {
        fPlant: {},
        img: [],
        visible: false,
    }
    getPlant = async (page, rows, finish) => {
        const user = memoryUtils.user
        const res = await reqGetPlant(page, rows,user.id, finish)
        const fPlant = res.data.data
        this.setState({ fPlant })
    }
    expandedRowRender = (record) => {
        const columns = [
            { title: '农药名', dataIndex: 'name', key: 'name',render: (text) => this.getDictValue("pesticide", text)},
            { title: '施药时间', dataIndex: 'date', key: 'date' },
        ];
        const plant =  record.plant? record.plant:{}
        const data = plant.pesticide? plant.pesticide:[]
        return (
            <Row>
                <Col span={12}>
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="产地">{plant.place}</Descriptions.Item>
                        <Descriptions.Item label="施药次数">{data.length}</Descriptions.Item>
                        <Descriptions.Item label="阶段图"> <Button style={{padding:"0"}} type="link" onClick={() => this.setState({ visible: true, img: plant.img })}>查看详情</Button></Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={12}>
                    <Table  rowKey="date" columns={columns} dataSource={data} pagination={false} />
                </Col>
            </Row>
    
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
    getDictValue = (name, id) => {    
        const { dict } = this.props
        if (dict[name] && Array.isArray(dict[name])) {
            const result = dict[name].find(item => item.valueId === id)
            if (result) {
                return result.valueName
            } else {
                return id
            }
        }
    }
  
    componentDidMount = () => {
        this.getPlant(1, 3, true)
    }
    render() {
        const { fPlant, visible, img } = this.state
        const columns = [
            { title: '茶叶名', dataIndex: 'name', key: 'name' },
            { title: '批次', dataIndex: 'batch', key: 'batch' },
            { title: '保质期', dataIndex: 'period', key: 'period' },
            { title: '产品等级', dataIndex: 'grade', key: 'grade' },
            { title: '存储条件', dataIndex: 'store', key: 'store' },
            { title: '二维码', dataIndex: 'qr', key: 'qr', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}><FileImageTwoTone /></Button> },
            { title: '产品图', dataIndex: 'img', key: 'img', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}><FileImageTwoTone /></Button> },
        ];
        const paginationProps = {
            showQuickJumper: true,
            showTotal: () => `共${fPlant.total}条`,
            total: fPlant.total,
            pageSize:3,
            onChange: (current) => this.getPlant(current,3,true),
        };
        return (
            <div>
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    rowKey="id"
                    expandable={{expandedRowRender:this.expandedRowRender}}
                    pagination={paginationProps}
                    dataSource={fPlant.content}
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