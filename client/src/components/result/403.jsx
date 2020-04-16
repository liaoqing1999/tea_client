import { Result, Button } from 'antd';
import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
 class Result403 extends Component {
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
            status="403"
            title="403"
            subTitle="抱歉，你没有权限访问这个页面."
            extra={<Button onClick={this.goBack} type="primary">返回上一页</Button>}
          />
        )
    }
}
export default withRouter(Result403)