import React, { Component } from 'react'
import { Menu, Row, Input, Col, Pagination, Spin, Card } from 'antd';
import {
    CoffeeOutlined
} from '@ant-design/icons';
import { reqTeaType, reqProducePage } from '../../../api';
const { SubMenu } = Menu;
const { Search } = Input;
const { Meta } = Card;
export default class Shop extends Component {
    state = {
        key: 'all',
        type: [],
        produceList: {},
        cond: {}
    };
    componentDidMount() {
        this.getTeaType()
        this.getData(1, 16, { state: "2" })
    }
    getData = async (page, rows, cond) => {
        const res = await reqProducePage(page, rows, cond)
        if (res.data.data) {
            const produceList = res.data.data
            cond = cond ? cond : { state: "2" }
            this.setState({ produceList, cond })
        }
    }
    getTeaType = async () => {
        const res = await reqTeaType()
        if (res.data.data) {
            const type = res.data.data
            this.setState({ type })
        }
    }
    handleClick = e => {
        this.setState({
            key: e.key,
        });
        const  {cond} = this.state
        if(e.key!=="all"){
            cond.typeId = e.key
        }else{
            delete cond.typeId
        }
        this.getData(1,16,cond)
    };
    onSearch = (value) =>{
        const  {cond} = this.state
        cond.name = value
        this.getData(1,16,cond)
    }
    currentOnChange = (page, pageSize) => {
        this.getData(page, pageSize, this.state.cond)
    }
    gerProduceCard = () => {
        const { produceList } = this.state
        if (!produceList.content) {
            return <Spin tip="正在查询中..." style={{ textAlign: "center" }} />
        }
        if (produceList.content.length > 0) {
            return produceList.content.reduce((pre, item) => {
                item.img = item.img ? item.img : [""]
                pre.push((
                    <Col span={6} key={item.id}>
                        <Card
                            style={{ textAlign: 'center' }}
                            hoverable
                            onClick={() => {this.props.history.push("/main/shop/detail", { produce:item }) }}
                            cover={<img alt={item.name} style={{ margin: "10px auto", width: "180px", height: "150px" }} src={global.ipfs.uri + item.img[0]} />}
                        >
                            <Meta title={item.name} />
                        </Card>

                    </Col>
                ))
                return pre
            }, [])
        } else {
            return <h1>暂无数据</h1>
        }
    }
    getMenu = (type) => {
        if (Array.isArray(type)) {
            return type.reduce((pre, item) => {
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.value}>
                            <CoffeeOutlined />
                            {item.label}
                        </Menu.Item>
                    ))
                } else {
                    pre.push((
                        <SubMenu key={item.value} title={item.label}>
                            {this.getMenu(item.children)}
                        </SubMenu>
                    ))
                }
                return pre
            }, [])
        }
    }
    render() {
        const { type, key, produceList } = this.state
        const current = produceList.page ? produceList.page : 1
        const pageSize = produceList.rows ? produceList.rows : 16
        const total = produceList.total ? produceList.total : 1
        return (
            <div className="about" style={{ width: "85%" }}>
                <div className="about-top">
                    <Row justify="space-between" style={{ width: "100%" }}>
                        <Col>
                            <Menu onClick={this.handleClick} selectedKeys={[key]} mode="horizontal">
                                <Menu.Item key="all">
                                    全部分类
                                </Menu.Item>
                                {this.getMenu(type)}
                            </Menu>
                        </Col>
                        <Col>
                            <Search
                                placeholder="搜索您需要的"
                                size="large"
                                onSearch={this.onSearch}
                            />
                        </Col>
                    </Row>
                </div>
                <div className="about-center">
                    <h1 style={{ fontSize: "200%", marginTop: "10px" }}>产品列表</h1>
                    <Row justify="start">
                        {this.gerProduceCard()}
                    </Row>
                    <Pagination style={{ textAlign: "center", marginTop: "15px" }} onChange={this.currentOnChange} current={current} pageSize={pageSize} total={total} />
                </div>
            </div>
        )
    }
}