import React, { Component } from 'react'
import SearchTea from '../searchtea';
import { Row, Col, Carousel, Descriptions, InputNumber, Button, Space, Tabs, Radio } from 'antd';
import { CoffeeOutlined, MessageOutlined } from '@ant-design/icons';
import './index.less'
import { reqProduceLike } from '../../../api';
const { TabPane } = Tabs
export default class ProduceDetail extends Component {
    constructor(props) {
        super(props)
        const { state } = this.props.location
        if (state && state.produce) {
            this.state = {
                produce: state.produce,
                n: 0
            }
            this.getDate(state.produce.type_id, state.produce.org)
        } else {
            this.props.history.goBack()
        }
    }
    getDate = async (typeId, org) => {
        const res = await reqProduceLike(typeId, org)
        if (res.data.data) {
            const likeProduces = res.data.data
            this.setState({ likeProduces })
        }
    }
    carousel = React.createRef();
    getCarousel(img) {
        if (Array.isArray(img)) {
            let i = 0
            return img.reduce((pre, item) => {
                pre.push((
                    <div key={i++}>
                        <img alt="img" style={{ width: "400px", height: "400px" }} src={global.ipfs.uri + item}></img>
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
    getSmallImg = (img, n) => {
        if (Array.isArray(img)) {
            return img.reduce((pre, item, index) => {
                const opacity = index === n ? 1 : 0.6
                pre.push((
                    <img onClick={() => this.carousel.current.slick.slickGoTo(index)} key={index} alt="img" style={{ margin: "0 10px", width: "60px", height: "60px", opacity: opacity }} src={global.ipfs.uri + item}></img>
                ))
                return pre
            }, [])
        } else {
            return <div>暂无图片</div>
        }
    }
    getLike = (list) => {
        if (Array.isArray(list)) {
            return list.reduce((pre, item, index) => {
                let img = ""
                if (item.img && item.img.length) {
                    img = item.img[0]
                }
                pre.push((
                    <Row style={{ margin: "10px" }} key={index} >
                        <Button style={{ padding: "0" }} type="link" onClick={() => { this.setState({ produce: item }) }}>
                            <img alt="" style={{ margin: "0 10px", width: "60px", height: "60px" }} src={global.ipfs.uri + img}></img>
                        </Button>

                        <div style={{ marginLeft: "10px" }}>
                            <Button style={{ padding: "0" }} type="link" onClick={() => { this.setState({ produce: item }) }}>
                                {item.name}
                            </Button>
                            <h1 style={{ color: "#c40000", fontSize: "18px" }}>{item.price * 0.9.toFixed(2)}￥</h1>
                        </div>

                    </Row>
                ))
                return pre
            }, [])
        } else {
            return <div>暂无推荐</div>
        }
    }
    render() {
        const { produce, n, likeProduces } = this.state
        return (
            <div className="about" style={{ width: "80%" }}>
                <div className="about-top">
                    <div className="about-top-left">
                        <h1>商品详情</h1>
                        <span>/</span>
                        <span onClick={() => this.props.history.goBack()}>返回列表页</span>
                    </div>
                    <div className="about-top-right">
                        <SearchTea></SearchTea>
                    </div>
                </div>
                <div className="about-center" style={{ padding: "10px" }}>
                    <Row>
                        <Col span={12}>
                            <Carousel autoplay afterChange={(current) => this.setState({ n: current })} effect="fade" ref={this.carousel}>
                                {this.getCarousel(produce.img)}
                            </Carousel>
                            <Row>
                                {this.getSmallImg(produce.img, n)}
                            </Row>
                        </Col>
                        <Col span={12}>
                            <h1 style={{ color: "#0d8048", fontSize: "24px" }}>{produce.name}</h1>
                            <strong style={{ color: "#c40000", fontSize: "16px", lineHeight: "35px" }}>{produce.desc}</strong>
                            <h1 style={{ fontSize: "16px", lineHeight: "35px" }}>品牌:<span>{produce.orgName}</span></h1>
                            <div style={{ color: "#333333" }}>
                                <Descriptions style={{ width: "300px" }} size="small" bordered column={1}>
                                    <Descriptions.Item label="规格">{produce.specs}</Descriptions.Item>
                                    <Descriptions.Item label="原价"><span className="delete">{produce.price}￥</span></Descriptions.Item>
                                    <Descriptions.Item label="优惠价"><span style={{ color: "#c40000", fontSize: "18px" }}>{produce.price * 0.9.toFixed(2)}￥</span></Descriptions.Item>
                                    <Descriptions.Item label="活动"><span style={{ color: "#c40000", fontSize: "15px" }}>购买后可返45积分</span></Descriptions.Item>
                                </Descriptions>
                                <h1 style={{ margin: "15px" }}>数量：<InputNumber defaultValue={1} min={0}></InputNumber>盒<span>（库存还剩{produce.reserve}）</span></h1>
                                <Button size="large" style={{ color: "#e75c00", background: "#fff5e6", marginRight: "10px" }}>立即购买</Button>
                                <Button size="large" style={{ color: "#fff", background: "#e78800" }}>加入购物车</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "30px" }}>
                        <Col span={6}>
                            <Button type="primary" style={{ width: "80%" }}>猜你喜欢</Button>
                            {this.getLike(likeProduces)}
                        </Col>
                        <Col span={18}>
                            <Tabs>
                                <TabPane tab={<span style={{ fontSize: "24px" }}><CoffeeOutlined />商品详情</span>} key="1">
                                    <h1 style={{ fontSize: "21px" }}>食用方式：<span style={{ fontSize: "15px", color: "#777" }}>{produce.eat}</span></h1>
                                    <h1 style={{ fontSize: "15px", color: "#777" }}>产品品质特征：外形：圆角长方形，表面平整、紧实，洒面明显，色泽棕褐，砖内无霉菌。</h1>
                                    <h1 style={{ fontSize: "15px", color: "#777" }}>内质：香气纯正（老茶香），汤色红褐尚明，滋味纯尚浓，叶底棕褐稍花。</h1>
                                </TabPane>
                                <TabPane tab={<span style={{ fontSize: "24px" }}><MessageOutlined />产品评论</span>} key="2">
                                    <Radio.Group defaultValue="a" buttonStyle="solid">
                                        <Radio.Button value="a">全部</Radio.Button>
                                        <Radio.Button value="b">好评</Radio.Button>
                                        <Radio.Button value="c">中评</Radio.Button>
                                        <Radio.Button value="d">差评</Radio.Button>
                                    </Radio.Group>
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}