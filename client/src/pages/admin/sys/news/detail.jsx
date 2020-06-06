import React, { Component } from 'react'
import {  Button, Table, Input, Rate, PageHeader } from 'antd'
import { reqNewsDetailByCond } from '../../../../api'
import { LikeTwoTone, DislikeTwoTone } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
export default class NewsDetail extends Component {

    constructor(props) {
        super(props)
        const { state } = this.props.location
        if (state && state.news) {
            let cond = {
                state: "2",
                news: state.news.id
            }
            this.getDate(cond)
        } else {
            this.props.history.goBack()
        }
    }
    state = {
        newsDetails: [],
        searchText: '',
        searchedColumn: '',
    }
    getDate = async (cond) => {
        const res = await reqNewsDetailByCond(cond)
        if (res.data.data) {
            const newsDetails = res.data.data
            cond = cond ? cond : {}
            this.setState({ newsDetails, cond })
        }
    }
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />

                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: "10px" }}
                >
                    查询
                    </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    重置
                    </Button>

            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                    text
                ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };
    render() {
        const columns = [
            {
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName',
                ...this.getColumnSearchProps('userName'),
            },
            {
                title: '日期',
                dataIndex: 'date',
                key: 'date',
                sorter: {
                    compare: (a, b) => new Date(a.date).getTime()  - new Date(b.date).getTime(),
                },
                render: (text) => moment(text).format("lll")
            },
            {
                title: '点赞',
                dataIndex: 'up',
                key: 'up',
                sorter: {
                    compare: (a, b) => a.up - b.up,
                },
                render: (text) => text ? (<LikeTwoTone />) : ("")
            },
            {
                title: '踩',
                dataIndex: 'down',
                key: 'down',
                sorter: {
                    compare: (a, b) => a.down - b.down,
                },
                render: (text) => text ? (<DislikeTwoTone />) : ("")
            },
            {
                title: '评分',
                dataIndex: 'rate',
                key: 'rate',
                sorter: {
                    compare: (a, b) => a.rate - b.rate,
                },
                render: (text) => <Rate disabled value={text}></Rate>
            },
        ];
        const { newsDetails } = this.state
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    onBack={() => this.props.history.goBack()}
                    title="用户资讯记录"
                />
                <Table rowKey="id" columns={columns} dataSource={newsDetails} />
            </div>
        )
    }
}