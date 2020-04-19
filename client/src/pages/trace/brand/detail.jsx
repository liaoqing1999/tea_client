import React, { Component } from 'react'
import SearchTea from '../searchtea';
import { Row, Col, Divider } from 'antd';
export default class OrgDetail extends Component {
    render() {
        const { state } = this.props.location
        if (!state) {
            this.props.history.goBack()
        }
        const { org } = state
        return (
            <div className="about"  style={{ width: "80%" }}>
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
                            <h1 style={{ fontSize: "25px",color: "#0d8048"}}>{org.name}</h1>
                            <p>{org.description}</p>
                        </Col>
                    </Row>
                    <Divider style={{backgroundColor:"#00FF7F"}}></Divider>
                    <Row>
                        <Col span={5}>
                            <h1 style={{textAlign:"center", fontSize: "25px",color: "#0d8048"}}>基础信息</h1>
                        </Col>
                        <Col span={19}>
                            <Row> <h1>法人代表：</h1>{org.corporation}</Row>
                            <Row> <h1>公司地点：</h1>{org.place}</Row>
                        </Col>
                    </Row>
                    <Divider style={{backgroundColor:"#00FF7F"}}></Divider>
                    <Row>
                        <Col span={5}>
                            <h1 style={{textAlign:"center", fontSize: "25px",color: "#0d8048"}}>旗下产品</h1>
                        </Col>
                        <Col span={19}>
                            <Row> {org.produce}</Row>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}