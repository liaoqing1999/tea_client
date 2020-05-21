import React from "react";
import { FileImageTwoTone } from '@ant-design/icons';
import { Table, Button, Carousel, Modal, Descriptions, } from 'antd'
import moment from 'moment';
import { reqGetProcess, reqGetStorage } from "../../../../api";
import memoryUtils from "../../../../utils/memoryUtils";
export default class FStorage extends React.Component {
    state = {
        fStorage: {},
        img: [],
        visible: false,
    }
    componentDidMount = () => {
        this.getStorage(1, 3, true)
    }
    componentWillReceiveProps(nextProps) {
        this.getStorage(1, 3, true)
    }
    getStorage = async (page, rows, finish) => {
        const user = memoryUtils.user
        const res = await reqGetStorage(page, rows, user.id, finish)
        const fStorage = res.data.data
        this.setState({ fStorage })
    }
    expandedRowRender = (record) => {
        const storage = record.storage ? record.storage :{}
        return (
            <Descriptions title="仓储记录">
                <Descriptions.Item label="仓储地点">{storage.place}</Descriptions.Item>
                <Descriptions.Item label="开始时间">{storage.startDate ? moment(storage.startDate).format("lll") : ""}</Descriptions.Item>
                <Descriptions.Item label="结束时间">{storage.endDate ? moment(storage.endDate).format("lll") : ""}</Descriptions.Item>
                <Descriptions.Item label="是否完成">{storage.finish ? "是" : "否"}</Descriptions.Item>
                <Descriptions.Item label="阶段图"><Button type="link" onClick={() => this.setState({ visible: true, img: storage.img })}>查看详情</Button></Descriptions.Item>
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

    render() {
        const { fStorage, visible, img } = this.state
        const columns = [
            { title: '茶叶名', dataIndex: 'name', key: 'name' },
            { title: '批次', dataIndex: 'batch', key: 'batch' },
            { title: '保质期', dataIndex: 'period', key: 'period' },
            { title: '产品等级', dataIndex: 'grade', key: 'grade', render: (text) => this.getDictValue('grade', text) },
            { title: '存储条件', dataIndex: 'store', key: 'store' },
            { title: '二维码', dataIndex: 'qr', key: 'qr', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}><FileImageTwoTone /></Button> },
            { title: '产品图', dataIndex: 'img', key: 'img', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}><FileImageTwoTone /></Button> },
        ];
        const paginationProps = {
            showQuickJumper: true,
            showTotal: () => `共${fStorage.total}条`,
            total: fStorage.total,
            pageSize: 3,
            onChange: (current) => this.getStorage(current, 3, true),
        };
        return (
            <div>
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    rowKey="id"
                    expandable={{ expandedRowRender: this.expandedRowRender }}
                    pagination={paginationProps}
                    dataSource={fStorage.content}
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