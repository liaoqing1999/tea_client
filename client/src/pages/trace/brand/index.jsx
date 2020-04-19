import React, { Component } from 'react'
import SearchTea from '../searchtea';
import {Pagination, Radio, Card, Col, Spin, Row } from 'antd';
import { reqOrgPage } from '../../../api';
import xzdq from '../image/xzdq_01.jpg'
import province from '../../../components/place/province';
const { Meta } = Card;
export default class Brand extends Component {
    state = {
        orgs: null,
        total: 0,
        current: 1,
        pageSize: 16,
        place:''
    }
    componentDidMount() {
        this.getDate(this.state.current, this.state.pageSize)
    }
    getDate = async (page, rows, place) => {
        const res = await reqOrgPage(page, rows, place)
        const result = res.data.data
        if (result.content) {
            this.setState({
                orgs: result.content,
                total: result.total,
                current: result.page,
                pageSize: result.rows,
            })
        }
    }
    getPlace = () => {
        return province.reduce((pre, item) => {
            pre.push((
                <Radio.Button style={{ width: "73px" }} key={item.id} value={item.name}>{item.name}</Radio.Button>
            ))
            return pre
        }, [])
    }
    placeOnChange = (e) => {
        this.getDate(1, this.state.pageSize, e.target.value)
        this.setState({place: e.target.value})
    }
    currentOnChange = (page, pageSize) => {
        this.getDate(page, pageSize, this.state.place)
    }

    gerOrgCard = () => {
        const orgs = this.state.orgs
        if (!orgs) {
            return <Spin tip="正在查询中..." style={{ textAlign: "center" }} />
        }
        if (orgs.length > 0) {
            let pre = []
            for (let i = 0; i < 4; i++) {
                pre.push((
                    <Row justify="space-between" key={i}>
                        {this.gerOrgCardCol(i)}
                    </Row>
                ))
            }
            return pre
        } else {
            return <h1>暂无数据</h1>
        }
    }
    onClick = (org) =>{
        this.props.history.push("/main/brand/detail",{org})
    }
    gerOrgCardCol = (i) => {
        const orgs = this.state.orgs
        const size = orgs.length > (i+1)*4 ? 4 : orgs.length - 4 * i
        if (orgs.length > 0) {
            if (i * 4 < orgs.length) {
                let col = []
                for (let j = 0; j < size; j++) {
                    col.push((
                        <Col key={orgs[4 * i + j].id}>
                            <Card
                                style={{ textAlign: 'center' }}
                                hoverable
                                onClick={() => this.onClick(orgs[4 * i + j])}
                                cover={<img alt={orgs[4 * i + j].name} style={{ margin: "10px", width: "180px", height: "150px" }} src={global.ipfs.uri + orgs[4 * i + j].trademark} />}
                            >
                                <Meta title={orgs[4 * i + j].name} />
                            </Card>
                        </Col>
                    ))
                }
                return col
            }
        }
    }
    render() {
        const { total,current,pageSize} = this.state
        return (
            <div className="about" style={{ width: "80%" }}>
                <div className="about-top">
                    <div className="about-top-left">
                        <h1>入驻品牌 </h1>
                        <span>/</span>
                        <span>已经有{total}家茶企在使用</span>
                    </div>
                    <div className="about-top-right">
                        <SearchTea></SearchTea>
                    </div>
                </div>
                <div className="about-center" style={{ padding: "10px" }}>
                    <Row>
                        <Col span={3}>
                            <img style={{ height: "130px", width: "130px" }} alt="" src={xzdq}></img>
                        </Col>
                        <Col span={21}>
                            <Radio.Group defaultValue="" buttonStyle="solid" onChange={this.placeOnChange}>
                                <Radio.Button style={{ width: "73px" }} value="">全部</Radio.Button>
                                {this.getPlace()}
                            </Radio.Group>
                        </Col>
                    </Row>
                    <h1 style={{fontSize:"200%",marginTop:"10px"}}>企业品牌</h1>
                    {this.gerOrgCard()}
                    <Pagination style={{textAlign:"center",marginTop:"15px"}} hideOnSinglePage={true}onChange={this.currentOnChange} current={current} pageSize={pageSize} total={total} />
                </div>
            </div>
        )
    }
}