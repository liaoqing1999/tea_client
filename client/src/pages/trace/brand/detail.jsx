import React, { Component } from 'react'
import SearchTea from '../searchtea';
import { Row, Col, Divider, Card } from 'antd';
import { reqOrgProduce } from '../../../api';
const { Meta } = Card;
export default class OrgDetail extends Component {
    constructor(props) {
        super(props)
        const { state } = this.props.location
        if (state && state.org) {
            this.getDate(state.org.id)
        } else {
            this.props.history.goBack()
        }
    }
    getDate = async (id) => {
        const res = await reqOrgProduce(id)
        if (res.data.data) {
            const produce = res.data.data
            this.setState({ produce })
        }
    }
    state = {
        produce: []
    }
    getPorduce = (id) => {
        const { produce } = this.state
        if (Array.isArray(produce)) {
            return produce.reduce((pre, item) => {
                item.img = item.img ? item.img : [""]
                pre.push((
                    <Col>
                        <Card
                            style={{ textAlign: 'center' }}
                            hoverable
                            onClick={() => { }}
                            cover={<img alt={item.name} style={{ margin: "10px", width: "180px", height: "150px" }} src={global.ipfs.uri + item.img[0]} />}
                        >
                            <Meta title={item.name} />
                        </Card>
                    </Col>
                ))
                return pre
            }, [])
        }
    }
    render() {
        const { state } = this.props.location
        if (!state) {
            this.props.history.goBack()
        }
        const { org } = state
        return (
            <div className="about" style={{ width: "80%" }}>
                <div className="about-top">
                    <div className="about-top-left">
                        <h1>入驻品牌 </h1>
                        <span>/</span>
                        <span onClick={() => this.props.history.goBack()}>返回列表页</span>
                    </div>
                    <div className="about-top-right">
                        <SearchTea></SearchTea>
                    </div>
                </div>
                <div className="about-center" style={{ padding: "10px" }}>
                    <Row>
                        <Col span={5}>
                            <img alt={org.name} style={{ margin: "10px", width: "150px", height: "150px" }} src={global.ipfs.uri + org.trademark} />
                        </Col>
                        <Col span={19}>
                            <h1 style={{ fontSize: "25px", color: "#0d8048" }}>{org.name}</h1>
                            <p>{org.description}</p>
                        </Col>
                    </Row>
                    <Divider style={{ backgroundColor: "#00FF7F" }}></Divider>
                    <Row>
                        <Col span={5}>
                            <h1 style={{ textAlign: "center", fontSize: "25px", color: "#0d8048" }}>基础信息</h1>
                        </Col>
                        <Col span={19}>
                            <Row> <h1>法人代表：</h1>{org.corporation}</Row>
                            <Row> <h1>公司地点：</h1>{org.place}</Row>
                        </Col>
                    </Row>
                    <Divider style={{ backgroundColor: "#00FF7F" }}></Divider>
                    <Row>
                        <Col span={5}>
                            <h1 style={{ textAlign: "center", fontSize: "25px", color: "#0d8048" }}>旗下产品</h1>
                        </Col>
                        <Col span={19}>
                            <Row gutter={10}> {this.getPorduce()}</Row>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}