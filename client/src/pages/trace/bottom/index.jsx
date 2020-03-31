import React,{Component} from 'react'
import './index.less'
import { withRouter} from 'react-router-dom'
import { Button } from 'antd';
class Top extends Component{

    state = {
        dayPictureUrl:'',
        weather:'',
        title:'',
    }
    render(){
        return(
            <div className="footer">
                <div className="footer-top">
                    <h1>友情链接</h1>
                    <a href="https://cn.unionpay.com/upowhtml/cn/templates/index/index.html">银联</a>
                    <a href="http://www.hutb.edu.cn/">湖南工商大学</a>    
                </div>
                <div className='footer-bottom'>
                    <div className="footer-bottom-left">
                        <a href="/main/about">关于我们</a>
                        <a href="/main/contact">联系方式</a>
                        <a href="/main/clause">服务条款</a>
                        <a href="/main/union">联盟</a>
                        <a href="/main/forum">论坛</a>
                        <h1>©2020 喝好茶 版权所有 湘ICP备xxxxxxx号</h1>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Top)