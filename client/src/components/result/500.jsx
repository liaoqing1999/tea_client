import { Result, Button } from 'antd';
import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
class Result500 extends Component {
    goBack = () => {
        if(this.props.location.pathname.indexOf('admin')!==-1){
            this.props.history.replace('/admin/info/user')
        }else{
            this.props.history.replace('/')
        }
    }
    render() {
        return (
            <Result
            status="500"
            title="500"
            subTitle="抱歉，服务器出错了."
            extra={<Button onClick={this.goBack} type="primary">返回首页</Button>}
          />
        )
    }
}
export default withRouter(Result500)