import React, { Component } from 'react'
import { Spin,Rate, Tabs, List, Avatar, Button } from 'antd';
import { EyeOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import SearchTea from '../searchtea';
import { reqDictionaryByCond, reqNewsPage } from '../../../api';
import { formateDate } from '../../../utils/dateUtils';
const { TabPane } = Tabs;
const IconText = ({ icon, text }) => (
    <span>
        {React.createElement(icon, { style: { marginRight: 8 } })}
        {text}
    </span>
);
export default class News extends Component {
    state = {
        title: [],
        text: ""
    }
    onChange = async (activeKey) => {
        const title = this.state.title
        if (!title[activeKey].news) {
            this.getNewsData(1, activeKey)
        }
        this.setState({
            text: title[activeKey].valueName,
        })
    }
    getNewsData = async (page, activeKey) => {
        const title = this.state.title
        const res = await reqNewsPage(page, 3, title[activeKey].valueId)
        title[activeKey].news = res.data.data
        this.setState({
            title: title
        })
    }
    /*使用reduce()+递归调用 */
    getContent = () => {
        const title = this.state.title
        let i = 0
        return title.reduce((pre, item) => {
            let total = item.news ? item.news.total : 0
            item.index = i
            pre.push((
                <TabPane tab={item.valueName} key={item.index} style={{ padding: "20px" }}>
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: page => {
                                this.getNewsData(page, item.index);
                            },
                            pageSize: 3,
                            total: total
                        }}
                    >
                        {this.getNews(i)}
                    </List>
                </TabPane>
            ))
            i++
            return pre
        }, [])
    }
    getNews = (i) => {
        const title = this.state.title
        const news = title[i].news
        if (news) {
            const newsList = news.content
            return newsList.reduce((pre, item) => {
                pre.push((
                    <List.Item
                        key={item.id}
                        actions={[
                            <IconText icon={LikeOutlined} text={item.up} key="list-vertical-like-o" />,
                            <IconText icon={DislikeOutlined} text={item.down} key="list-vertical-star-o" />,
                            <IconText icon={EyeOutlined} text={item.read} key="list-vertical-star-o" />,
                            <Rate character="好" allowHalf disabled value={item.rate} />,
                            <span>{"参评人数:" + item.rateNum}</span>,
                            <span>{'发布时间:' + formateDate(item.date)}</span>,
                        ]}
                        extra={
                            <img
                                width={272}
                                alt="cover"
                                src={global.ipfs.uri + item.cover}
                            />
                        }
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={global.ipfs.uri + item.avatar} />}
                            title={<a href={item.href}>{item.title}</a>}
                            description={item.desc}
                        />

                        <span>作者：</span>{item.writer}
                        <span style={{ marginLeft: "10px" }}>发布人：</span>{item.publisher}
                        {item.org ? (<span style={{ marginLeft: "10px" }}>所属机构：{item.org}</span>) : ("")}
                        <Button type="link" onClick={(event) => this.viewNews(item)}>查看详情>></Button>
                    </List.Item>
                ))
                i++
                return pre
            }, [])
        }
    }
    viewNews = (news) => {
        this.props.history.push("/main/news/detail",{news})
    }
    componentDidMount() {
        this.getTabTitleDate()
    }
    getTabTitleDate = async () => {
        const res = await reqDictionaryByCond('news_type')
        const title = res.data.data
        if (title.length) {
            const r = await reqNewsPage(1, 3, title[0].valueId)
            title[0].news = r.data.data
            this.setState({ title, text: title[0].valueName })
        }
    }
    render() {
        const { title, text } = this.state
        return (
            <div className="about">
                <div className="about-top">
                    <div className="about-top-left">
                        <h1>资讯</h1>
                        <span>/</span>
                        <span>{text}</span>
                    </div>
                    <div className="about-top-right">
                        <SearchTea></SearchTea>
                    </div>
                </div>
                <div className="about-center">
                    {title.length==0?(<Spin tip="正在查询中..." style={{ textAlign: "center" }} />):
                    ( <Tabs defaultActiveKey="0" tabPosition="left" onChange={this.onChange}>
                        {this.getContent()}
                    </Tabs>)}
                </div>
            </div>
        )
    }
}