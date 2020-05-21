import React from "react";
import { FileImageTwoTone } from '@ant-design/icons';
import { Table, Button, Carousel, Modal, } from 'antd'
import moment from 'moment';
import { reqGetProcess } from "../../../../api";
import memoryUtils from "../../../../utils/memoryUtils";
export default class FProcess extends React.Component {
    state = {
        fProcess: {},
        img: [],
        visible: false,
    }
    componentDidMount = () => {
        this.getProcess(1, 3, true)
    }
    componentWillReceiveProps(nextProps) {
        this.getProcess(1, 3, true)
    }
    getProcess = async (page, rows, finish) => {
        const user = memoryUtils.user
        const res = await reqGetProcess(page, rows, user.id, finish)
        const fProcess = res.data.data
        this.setState({ fProcess })
    }
    expandedRowRender = (record) => {
        const columns = [
            { title: '加工方法', dataIndex: 'method', key: 'method', render: (text) => this.getDictValue('process', text) },
            { title: '开始时间', dataIndex: 'startDate', key: 'batstartDatech', render: (text) => moment(text).format("lll") },
            { title: '结束时间', dataIndex: 'endDate', key: 'endDate', render: (text) => moment(text).format("lll") },
            { title: '是否完成', dataIndex: 'finish', key: 'finish', render: (text) => text ? "是" : "否" },
            { title: '阶段图', dataIndex: 'img', key: 'img', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}>查看详情</Button> },

        ];
        const process = record.process ? record.process : []
        return (
            <Table title={(c) => "加工记录"} rowKey="startDate" columns={columns} dataSource={process} pagination={false} />
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
        const { fProcess, visible, img } = this.state
        const columns = [
            { title: '茶叶名', dataIndex: 'name', key: 'name' },
            { title: '批次', dataIndex: 'batch', key: 'batch' },
            { title: '保质期', dataIndex: 'period', key: 'period' },
            { title: '产品等级', dataIndex: 'grade', key: 'grade',render: (text) => this.getDictValue('grade', text) },
            { title: '存储条件', dataIndex: 'store', key: 'store' },
            { title: '二维码', dataIndex: 'qr', key: 'qr', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}><FileImageTwoTone /></Button> },
            { title: '产品图', dataIndex: 'img', key: 'img', render: (text) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}><FileImageTwoTone /></Button> },
        ];
        const paginationProps = {
            showQuickJumper: true,
            showTotal: () => `共${fProcess.total}条`,
            total: fProcess.total,
            pageSize: 3,
            onChange: (current) => this.getProcess(current, 3, true),
        };
        return (
            <div>
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    rowKey="id"
                    expandable={{ expandedRowRender: this.expandedRowRender }}
                    pagination={paginationProps}
                    dataSource={fProcess.content}
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