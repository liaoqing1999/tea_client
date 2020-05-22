import React, { Component } from 'react'
import { reqOrgChart } from '../../../../api'
import ReactEcharts from 'echarts-for-react'
import {  Row, Col, Card } from 'antd'
import { BankTwoTone,HomeTwoTone ,GoldTwoTone} from '@ant-design/icons';
let _this = {}
export default class OrgChart extends Component {
    state = {
        data: {},
        cond: {},
    }

    componentDidMount() {
        this.getData()
        _this = this
    }
    getData = async (cond) => {
        const res = await reqOrgChart(cond)
        if (res.data.data) {
            const data = res.data.data
            cond = cond ? cond : {}
            this.setState({ data, cond })
        }
    }
    getPlaceOption = (data) => {
        const { cond } = this.state
        let xdata = []
        let ydata = []
        if (Array.isArray(data)) {
            let xMax = 0
            let str = ""
            data.forEach(item => {
                if (Array.isArray(item._id)) {
                    xdata.push(item._id[item._id.length - 1])
                }
                ydata.push(item.count)
            });
        }
        return {
            title: { text: '机构地点分析' },
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
                    myTool1: {//自定义按钮 danielinbiti,这里增加，selfbuttons可以随便取名字  
                        show: true,//是否显示  
                        title: '重置查询', //鼠标移动上去显示的文字  
                        icon: 'image://http://localhost:3000/static/media/GREEN_TEA.cb6acb79.svg', //图标  
                        option: {},
                        onclick: (option1)=> {//点击事件,这里的option1是chart的option信息  
                            this.getData()
                        }
                    },
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
                    name: '机构数量',
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
    onclick = {
        'click': this.clickEchartsPie
    }
    clickEchartsPie(e) {
        let { cond } = _this.state

        if (cond.type === 'city') {
            cond.type = 'area'
            cond.place = cond.place + "-" + e.name
            _this.getData(cond)
        } else if (cond.type === 'area') {
            cond = {}
        } else {
            cond.type = 'city'
            cond.place = e.name
            _this.getData(cond)
        }

    }
    render() {
        const { data } = this.state
        return (
            <div className="top">
                <Row justify="space-between" style={{marginBottom:"10px",paddingBottom:"15px"}}>
                    <Col span={6}>
                        <Card hoverable bodyStyle={{ padding: 0, marginLeft: "10px" }}>
                            <h1 style={{ fontSize: "20px", fontFamily: "SimHei", fontWeight: "200%", margin: "0" }}>机构总数量</h1>
                            <Row justify="space-around" align="middle">
                                <h1 style={{ fontSize: "16px", color: "blue" }}>{data.sumTotal}</h1>
                                <BankTwoTone  style={{ fontSize: "85px" }} />
                            </Row>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card hoverable bodyStyle={{ padding: 0, marginLeft: "10px" }}>
                            <h1 style={{ fontSize: "20px", fontFamily: "SimHei", fontWeight: "200%", margin: "0" }}>目前申请入驻数量</h1>
                            <Row justify="space-around" align="middle">
                                <h1 style={{ fontSize: "16px", color: "blue" }}>{data.applyTotal}</h1>
                                <GoldTwoTone  style={{ fontSize: "85px" }} />
                            </Row>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card hoverable bodyStyle={{ padding: 0, marginLeft: "10px" }}>
                            <h1 style={{ fontSize: "20px", fontFamily: "SimHei", fontWeight: "200%", margin: "0" }}>目前已入驻数量</h1>
                            <Row justify="space-around" align="middle">
                                <h1 style={{ fontSize: "16px", color: "blue" }}>{data.joinTotal}</h1>
                                <HomeTwoTone   style={{ fontSize: "85px" }} />
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <ReactEcharts
                    style={{ height: 350, width: "100%" }}
                    notMerge={true}
                    lazyUpdate={true}
                    option={this.getPlaceOption(data.place)}
                    onEvents={this.onclick}
                />
            </div>
        )
    }
}