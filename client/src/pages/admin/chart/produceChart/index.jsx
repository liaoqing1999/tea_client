import React, { Component } from 'react'
import { reqProduceChart, reqDictType } from '../../../../api'
import ReactEcharts from 'echarts-for-react'
import { Row, Col, Card } from 'antd'
import {ShopTwoTone } from '@ant-design/icons';
let _this = {}
export default class ProduceChart extends Component {
    state = {
        data: {},
        cond: {},
        dict: {},
    }

    componentDidMount() {
        this.getData()
        this.getDict(['type', 'grade'])
        _this = this
    }
    getData = async (cond) => {
        const res = await reqProduceChart(cond)
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


    getGradeOption = (data) => {
        const { dict } = this.state
        let grade = []
        if (dict['grade'] && Array.isArray(dict['grade'])) {
            dict['grade'].forEach(item => {
                grade.push(item.valueName)
            });
            grade.push("空")
        }
        if (data && Array.isArray(data)) {
            data.forEach(item => {
                if (item._id) {
                    item.name = this.getDictValue('grade', item._id)
                } else {
                    item.name = "空"
                }
                item.value = item.count
            });
        }
        return {
            title: { text: '产品等级分析' },
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
                data: grade
            },
            series: [
                {
                    name: '产品等级分析',
                    type: 'pie',
                    data: data,
                }
            ]
        }
    }

    getOrgOption = (data) => {
        if (data && Array.isArray(data)) {
            data.forEach(item => {
                if(item.orgName&&Array.isArray(item.orgName)){
                    item.name = item.orgName[0]
                }else{
                    item.name = "空"
                }    
                item.value = item.count
            });
        }
        return {
            title: { text: '产品机构分析' },
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
                    name: '产品机构分析',
                    type: 'pie',
                    data: data,
                }
            ]
        }
    }

    getTypeOption = (data) => {
        const { cond, dict } = this.state
        let str = cond.typeId ? "" : "00"
        let xdata = []
        let ydata = []
        if (Array.isArray(data)) {
            if (dict['type'] && Array.isArray(dict['type'])) {
                data.forEach(item => {
                    xdata.push(this.getDictValue('type', item._id + str))
                    ydata.push(item.count)
                });
            }

        }
        return {
            title: { text: '产品类别分析' },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['产品类别']
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
                        onclick: (option1) => {//点击事件,这里的option1是chart的option信息  
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
                    name: '产品数量',
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
        let { data, cond } = _this.state
        if (!cond.typeId && data && Array.isArray(data.type)) {
            let typeId = data.type[e.dataIndex]._id
            cond.typeId = typeId
            _this.getData(cond)
        }
    }
    render() {
        const { data } = this.state
        return (
            <div className="top">
                <Row justify="space-between" style={{ marginBottom: "10px", paddingBottom: "15px" }}>
                    <Col span={4}>
                        <Card hoverable bodyStyle={{ padding: 0, marginLeft: "10px" }}>
                            <h1 style={{ fontSize: "20px", fontFamily: "SimHei", fontWeight: "200%", margin: "0" }}>产品总数量</h1>
                            <Row justify="space-around" align="middle">
                                <h1 style={{ fontSize: "16px", color: "blue" }}>{data.total}</h1>
                                <ShopTwoTone style={{ fontSize: "85px" }} />
                            </Row>
                        </Card>
                    </Col>
                    <Col span={10}>
                        <ReactEcharts
                            style={{ height: 350, width: "100%" }}
                            notMerge={true}
                            lazyUpdate={true}
                            option={this.getGradeOption(data.grade)}
                        />
                    </Col>
                    <Col span={10}>
                        <ReactEcharts
                            style={{ height: 350, width: "100%" }}
                            notMerge={true}
                            lazyUpdate={true}
                            option={this.getOrgOption(data.org)}
                        />
                    </Col>
                </Row>
                <ReactEcharts
                    style={{ height: 350, width: "100%" }}
                    notMerge={true}
                    lazyUpdate={true}
                    option={this.getTypeOption(data.type)}
                    onEvents={this.onclick}
                />
            </div>
        )
    }
}