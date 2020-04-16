import React, { Component } from "react";
import { Result, Button } from 'antd';
import { withRouter } from 'react-router-dom'
class Result404 extends Component {
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
            status="404"
            title="404"
            subTitle="抱歉，此页面未找到."
            extra={<Button onClick={this.goBack} type="primary">返回首页</Button>}
          />
        )
    }
}
export default withRouter(Result404)