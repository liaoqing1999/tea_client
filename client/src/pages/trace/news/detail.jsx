import React, { Component } from 'react'
import SearchTea from '../searchtea';
import { EyeOutlined, EyeTwoTone, LikeTwoTone, LikeOutlined, DislikeTwoTone, DislikeOutlined } from '@ant-design/icons';
import { Row, Col, Divider, Tooltip, Rate, Button, message } from 'antd';
import { formateDate } from '../../../utils/dateUtils';
import memoryUtils from '../../../utils/memoryUtils';
import { reqNewsDetailUser,reqUpdateNewsDetail,reqUpdateNewsUser } from '../../../api';

export default class NewsDetail extends Component {
    state = {
        newsDetail: {},
        up: 0,
        down: 0,
        rateNum:0,
        rate:0
    }
    componentDidMount() {
        const user = memoryUtils.user
        if (user && user.id) {
            this.getNewsDetail(user.id)
        }
    }
    componentWillUnmount=() =>{
        const {newsDetail,up,down,rate,rateNum} = this.state
        const { state } = this.props.location
        if(state){
            if(newsDetail.id){
                reqUpdateNewsDetail(newsDetail)
            }
            let news = state.news
            news.up = up
            news.down = down
            news.rate = rate?rate:0
            news.rateNum = rateNum
            reqUpdateNewsUser(news)
        }   
    }
    up = () => {
        let { newsDetail, up, down } = this.state
        const user = memoryUtils.user
        if (user.id) {
            if (newsDetail.up) {
                message.info("已经点过赞了奥")
            } else {
                up += 1
                newsDetail.up = true
                if (newsDetail.down) {
                    newsDetail.down = false
                    down -= 1
                }
                this.setState({ newsDetail, up, down })
                message.success("点赞成功！感谢您的支持")
            }
        } else {
            message.warn("还未登录，不能点赞噢")
        }
    }
    down = () => {
        let { newsDetail, up, down } = this.state
        const user = memoryUtils.user
        if (user.id) {
            if (newsDetail.down) {
                message.info("已经踩过了奥")
            } else {
                down += 1
                newsDetail.down = true
                if (newsDetail.up) {
                    newsDetail.up = false
                    up -= 1
                }
                this.setState({ newsDetail, up, down })
                message.success("感谢您的参与，我们会继续努力！")
            }
        } else {
            message.warn("还未登录，不能踩噢")
        }
    }
    rateChange = value => {
        let { newsDetail,rate,rateNum} = this.state
        const user = memoryUtils.user
        if (user.id) {
            if(newsDetail.rate>0){
                message.info("已经评过分了")
            }else{
                newsDetail.rate = value
                rate = value
                rateNum +=1
                this.setState({newsDetail,rate,rateNum})
                message.success("感谢您的评分与支持！")
            }
        } else {
            message.warn("还未登录，不能评分噢")
        }
        this.setState({ value });
    };
    getNewsDetail = async (userId) => {
        const { state } = this.props.location
        const { news } = state
        const res = await reqNewsDetailUser(news.id, userId)
        const newsDetail = res.data.data
        if (newsDetail.id) {
            this.setState({ newsDetail: newsDetail })
        }
    }
    render() {
        const { state } = this.props.location
        const { newsDetail, up, down,rate,rateNum } = this.state
        if (!state) {
            this.props.history.goBack()
        }
        const { news } = state
        const upText = newsDetail.up ? "您已经点过赞了" : "点赞人数: " + (news.up + up)
        const downText = newsDetail.down ? "您踩过了" : "踩: " + (news.down + down)
        const rateDisable = newsDetail.rate > 0
        const rateValue = (news.rate*news.rateNum+rate)/(news.rateNum+rateNum)
        return (
            <div className="about" style={{ width: "80%" }}>
                <div className="about-top">
                    <div className="about-top-left">
                        <h1>资讯详情</h1>
                        <span>/</span>
                        <span onClick={() => this.props.history.goBack()}>返回资讯列表</span>
                    </div>
                    <div className="about-top-right">
                        <SearchTea></SearchTea>
                    </div>
                </div>
                <div className="about-center" style={{ padding: "10px" }}>
                    <h1 style={{ textAlign: "center", fontSize: "25px" }}>{news.title}</h1>
                    <Row justify="space-between">
                        <Col>
                            <span>{formateDate(news.date)}</span>
                        </Col>
                        <Col>
                            <Rate style={{ margin: "0 8px" }} onChange={this.rateChange} allowHalf disabled={rateDisable} value={rateValue} />
                            <span>{"参评人数:" + news.rateNum}</span>
                        </Col>
                    </Row>
                    <Row justify="space-between">
                        <Col>
                            <span>作者：</span>{news.writer}
                            <span style={{ marginLeft: "10px" }}>发布人：</span>{news.publisher}
                            {news.orgName ? (<span style={{ marginLeft: "10px" }}>所属机构：{news.orgName}</span>) : ("")}
                        </Col>
                        <Col>
                            <Tooltip title={upText}>
                                <Button onClick={this.up} icon={newsDetail.up ? <LikeTwoTone style={{ margin: "0 8px" }} /> : <LikeOutlined style={{ margin: "0 8px" }} />} style={{ padding: "0", border: "none" }} >{(news.up + up)}</Button>
                            </Tooltip>
                            <Tooltip title={downText}>
                                <Button onClick={this.down} icon={newsDetail.down ? <DislikeTwoTone style={{ margin: "0 8px" }} /> : <DislikeOutlined style={{ margin: "0 8px" }} />} style={{ padding: "0", border: "none" }} >{(news.down + down)}</Button>
                            </Tooltip>
                            <Tooltip title={"阅读人数: " + news.read}>
                                <Button icon={newsDetail.id ? <EyeTwoTone style={{ margin: "0 8px" }} /> : <EyeOutlined style={{ margin: "0 8px" }} />} style={{ padding: "0", border: "none" }} >{news.read}</Button>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Divider ></Divider>
                    <div dangerouslySetInnerHTML={{__html:news.content}}></div>
                    <Divider ></Divider>
                    <Row>
                        <Button style={{ padding: "0" }} type="link">已经到底了，点个赞呗</Button>
                    </Row>
                    <Tooltip title={upText}>
                        <Button onClick={this.up} icon={newsDetail.up ? <LikeTwoTone style={{ margin: "0 8px" }} /> : <LikeOutlined style={{ margin: "0 8px" }} />} style={{ padding: "0", border: "none" }} >{(news.up + up)}</Button>
                    </Tooltip>
                    <Tooltip title={downText}>
                        <Button onClick={this.down} icon={newsDetail.down ? <DislikeTwoTone style={{ margin: "0 8px" }} /> : <DislikeOutlined style={{ margin: "0 8px" }} />} style={{ padding: "0", border: "none" }} >{(news.down + down)}</Button>
                    </Tooltip>
                    <Rate style={{ margin: "0 8px" }} onChange={this.rateChange} allowHalf disabled={rateDisable} value={rateValue} />
                </div>
            </div>
        )
    }
}