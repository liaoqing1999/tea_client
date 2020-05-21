import React from "react";
import { FileImageTwoTone } from '@ant-design/icons';
import { Table, Button, Carousel, Modal, } from 'antd'
import moment from 'moment';
import { reqGetCheck } from "../../../../api";
import memoryUtils from "../../../../utils/memoryUtils";
export default class FCheck extends React.Component {
    state = {
        fProcess: {},
        img: [],
        visible: false,
    }
    componentDidMount = () => {
        this.getCheck(1, 3, true)
    }
    componentWillReceiveProps(nextProps) {
        this.getCheck(1, 3, true)
    }
    getCheck = async (page, rows, finish) => {
        const user = memoryUtils.user
        const res = await reqGetCheck(page, rows, user.id, finish)
        const fProcess = res.data.data
        this.setState({ fProcess })
    }
    expandedRowRender = (record) => {
        const columns = [
            { title: '检测类型', dataIndex: 'typeId', key: 'typeId', render: (text) => this.getDictValue('check', text) },
            { title: '时间', dataIndex: 'date', key: 'date', render: (text) => text ? moment(text).format("lll") : "" },
            { title: '结果', dataIndex: 'result', key: 'result', render: (text) => this.getDictValue('result', text) },
            { title: '是否完成', dataIndex: 'finish', key: 'finish', render: (text) => text ? "是" : "否" },
            { title: '具体详情', dataIndex: 'info', key: 'img', render: (text, record, index) => <Button type="link" onClick={() => this.setState({ visible: true, img: text })}>查看详情</Button> },
        ];
        const check = record.check ? record.check : []
        return (
            <Table title={(c) => "加工记录"} rowKey="date" columns={columns} dataSource={check} pagination={false} />
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
        }  else if (img) {
            return <div><img alt="img" src={global.ipfs.uri + img}></img> </div>
        } else {
            return <div>暂无图片</div>
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
            { title: '产品等级', dataIndex: 'grade', key: 'grade', render: (text) => this.getDictValue('grade', text) },
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