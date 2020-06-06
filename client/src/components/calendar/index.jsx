import React, { Component } from 'react'
import solarlunar from 'solarlunar';
import { Modal, Calendar, Popover } from 'antd';
import moment from 'moment'
export default class NowTime extends Component {
    state = {
        currenTime: moment().format('LL')+"-"+moment().format('LTS'),
        date: moment()
    }
    getTime = () => {
        this.interval = setInterval(() => {
            const currenTime = moment().format('LL')+"-"+moment().format('LTS');
            this.setState({ currenTime })
        }, 1000)
    }
    /*
  第一次render()之后执行一次
  一般在此执行异步操作：发ajax请求/启动定时器
   */
    componentDidMount() {
        //获取当前时间
        this.getTime()
    }
    /*当前组件卸载之前调用 */
    componentWillUnmount() {
        //清除定时器
        clearInterval(this.interval)
    }
    onPanelChange = (value) => {
        this.setState({ date: value });
    }
    dateCellRender = (value) => {
        const data = solarlunar.solar2lunar(value.year(), value.month() + 1, value.date())
        const { date } = this.state
        const content = (
            <div>
                <p>{value.format('l') === moment().format('l') ? "今天" : data.ncWeek}
                    {"  " + data.monthCn + data.dayCn + "  " + data.term}</p>
                <p>{data.gzYear + '-' + data.gzMonth + '-' + data.gzDay}</p>
            </div>
        );
        let color;
        if (value.month() !== date.month()) {
            color = "rgba(0, 0, 0, 0.25)"
        }
        return (
            <Popover content={content} title="详情" >
                <span style={{ color: color ? color : "black" }}>{data.term ? <span style={{ color: color ? color : "red" }}>{data.term}</span> : data.dayCn === '初一' ? data.monthCn : data.dayCn}</span>
            </Popover>
        );
    }
    render() {
        const { currenTime, visible } = this.state;
        return (
            <span>
                <span onClick={() => this.setState({ visible: true, date: moment() })}>{currenTime}</span>
                <Modal
                    title="日历"
                    visible={visible}
                    footer={null}
                    bodyStyle={{ backgroundColor: "white" }}
                    onCancel={() => { this.setState({ visible: false }) }}
                >
                    <Calendar value={this.state.date} dateCellRender={this.dateCellRender} fullscreen={false} onPanelChange={this.onPanelChange} />
                </Modal>
            </span>
        )
    }
}