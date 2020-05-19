import React, { Component } from 'react'
import ReactEcharts from 'echarts-for-react'
import moment from 'moment';
import 'moment/locale/zh-cn';
import { reqStaffChart, reqDictType } from '../../../../api'
import { DatePicker, Radio, Row, Col, Card } from 'antd'
import {ContactsTwoTone} from '@ant-design/icons';
const { RangePicker } = DatePicker;
export default class StaffChart extends Component {
    state = {
        data: {},
        cond: {},
        dict: {},
        date: [
            moment().startOf('month'),
            moment().endOf('month')
        ]
    }
    getData = async (cond) => {
        if (cond && cond.date && Array.isArray(cond.date)) {
            cond.dates = []
            for (let i = 0; i < cond.date.length; i++) {
                cond.dates[i] = cond.date[i].format('YYYY-MM-DD')
            }
        }
        const res = await reqStaffChart(cond)
        if (res.data.data) {
            const data = res.data.data
            cond = cond ? cond : {}
            this.setState({ data, cond })
        }
    }
    getDict = async (typecode) => {
        const res = await reqDictType(typecode)
        if (res.data.data) {
            const dict = res.data.data
            this.setState({ dict })
        }
    }
    getDictValue = (name, id) => {
        const { dict } = this.state
        if (dict[name] && Array.isArray(dict[name])) {
            const result = dict[name].find(item => item.valueId === id)
            if (result) {
                return result.valueName
            } else {
                return id
            }
        }
    }
    componentDidMount() {
        this.getData({ date: this.state.date, type: "month" })
        this.getDict(['sex'])
    }
    onChange = (dates) => {
        this.setState({ date: dates })
        this.getData({ date: dates })
    }
    dateTypeOnchage = (e) => {
        let date = []
        if (e.target.value === 'month') {
            date.push(moment().startOf('month'))
            date.push(moment().endOf('month'))
        } else if (e.target.value === 'week') {
            date.push(moment().startOf('isoWeek'))
            date.push(moment().endOf('isoWeek'))
        } else if (e.target.value === 'year') {
            date.push(moment().startOf('year'))
            date.push(moment().endOf('year'))
        } else {
            date.push(moment().set({ 'year': 1901, 'month': 0, 'date': 1 }))
            date.push(moment().set({ 'year': 2100, 'month': 11, "date": 31 }))
        }
        this.setState({ date })
        this.getData({ date: date, type: e.target.value })
    }
    getSexOption = (data) => {
        const { dict } = this.state
        let sex = []
        if (dict['sex'] && Array.isArray(dict['sex'])) {
            dict['sex'].forEach(item => {
                sex.push(item.valueName)
            });
        }
        sex.push("空")
        if (data && Array.isArray(data)) {
            data.forEach(item => {
                if (item._id) {
                    item.name = this.getDictValue('sex', item._id)
                } else {
                    item.name = "空"
                }
                item.value = item.count
            });
        }
        return {
            title: { text: '用户性别分析' },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: {
                        show: true,
                        type: 'jpg'
                    }
                }
            },
            legend: {
                orient: 'vertical',
                top: 30,
                right: 5,
                data: sex
            },
            series: [
                {
                    name: '用户性别分析',
                    type: 'pie',
                    data: data,
                }
            ]
        }
    }
    getWorkOption = (data) => {
        if (data && Array.isArray(data)) {
            data.forEach(item => {
                if (item._id) {
                    item.name = item._id
                } else {
                    item.name = "空"
                }
                item.value = item.count
            });
        }
        return {
            title: { text: '用户职业分析' },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: {
                        show: true,
                        type: 'jpg'
                    }
                }
            },
            series: [
                {
                    name: '用户职业分析',
                    type: 'pie',
                    data: data,
                }
            ]
        }
    }
    getDateOption = (data) => {
        const { date, cond } = this.state
        let xdata = []
        let ydata = []
        if (Array.isArray(data)) {
            let xMax = 0
            let str = ""
            if (cond && cond.type) {
                if (cond.type === 'month') {
                    xMax = date[0].daysInMonth()
                    str = '日'
                } else if (cond.type === 'week') {
                    xMax = 7
                    str = '日'
                } else if (cond.type === 'year') {
                    xMax = 12
                    str = '月'
                } else {
                    xMax = data.length
                    str = '年'
                }
                for (let i = 1; i <= xMax; i++) {
                    let j = i
                    if (cond.type === 'all') {
                        j = Number(data[0]._id) + j - 1
                    }
                    if (cond.type === 'week') {
                        j = Number(data[0]._id) + j - 1
                    }
                    xdata.push(j + str)
                    const result = data.find(item => Number(item._id) === j)
                    if (result) {
                        ydata.push(result.count)
                    } else {
                        ydata.push(0)
                    }
                }
            } else {
                data.forEach(item => {
                    xdata.push(item._id)
                    ydata.push(item.count)
                });
            }

        }
        return {
            title: { text: '用户新增分析' },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['用户数量']
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: {
                        show: true,
                        type: 'jpg'
                    }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: xdata
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '用户数量',
                    type: 'bar',
                    data: ydata,
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                },
            ]
        }
    }
    render() {
        const { data, date } = this.state
        return (
            <div className="top">
                <Row gutter={30}>
                    <Col span={4}>
                        <Card hoverable bodyStyle={{padding:0,marginLeft:"10px"}}>
                            <h1 style={{fontSize:"20px",fontFamily:"SimHei",fontWeight:"200%",margin:"0"}}>用户数量</h1>
                            <Row justify="space-around" align="middle">
                                <h1 style={{fontSize:"16px",color:"blue"}}>{data.total}</h1>
                                <ContactsTwoTone style={{fontSize:"85px"}}/>
                            </Row>
                         
                        </Card>
                    </Col>
                    <Col span={10}>
                        <ReactEcharts
                            style={{ height: 350, width: "100%" }}
                            notMerge={true}
                            lazyUpdate={true}
                            option={this.getSexOption(data.sex)}
                        />
                    </Col>
                    <Col span={10}>
                        <ReactEcharts
                            style={{ height: 350, width: "100%" }}
                            notMerge={true}
                            lazyUpdate={true}
                            option={this.getWorkOption(data.work)}
                        />
                    </Col>
                </Row>
                <Row justify="end">
                    <Radio.Group defaultValue="month" style={{ margin: "0 10px" }} onChange={this.dateTypeOnchage} buttonStyle="solid">
                        <Radio.Button value="all">全部</Radio.Button>
                        <Radio.Button value="year">全年</Radio.Button>
                        <Radio.Button value="month">本月</Radio.Button>
                        <Radio.Button value="week">本周</Radio.Button>
                    </Radio.Group>
                    <RangePicker allowClear={false} value={date} onChange={this.onChange} />
                </Row>

                <ReactEcharts
                    style={{ height: 350, width: "100%" }}
                    notMerge={true}
                    lazyUpdate={true}
                    option={this.getDateOption(data.addTent)}
                />
            </div>
        )
    }
}