import React,{Component} from 'react'
import './index.less'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils';
import { withRouter} from 'react-router-dom'
import { reqWeather } from '../../api';
import menuList from '../../config/menuConfig';
import { Modal, Button } from 'antd';
import storageUtils from '../../utils/storageUtils';
class Top extends Component{

    state = {
        currenTime:formateDate(Date.now()),
        dayPictureUrl:'',
        weather:'',
        title:'',
    }
    getTime = () =>{
        this.interval = setInterval(()=>{
            const currenTime = formateDate(Date.now());
            this.setState({currenTime})
        },1000)
    }
    getWeather =async () =>{
        const {dayPictureUrl,weather} = await reqWeather('changsha')
        this.setState({dayPictureUrl,weather})
    }
    //获取标题中的递归函数
    getTitleForEach = (list,path) =>{
        let title
        
        list.forEach(item =>{
            if(item.key===path){
                title = item.title;
            }else if(item.children){
                const t = this.getTitleForEach(item.children,path) 
                if(t) title =t;
            }
           
        })
        return title;
    }
    //获取标题
    getTitle = () =>{
        const path = this.props.location.pathname;
        const title =this.getTitleForEach(menuList,path)
       
        return title;
    }
    logout = () =>{
        Modal.confirm({
            title: '确认退出登录吗?',
            content: '这可能会导致某些数据未保存',
            onOk:()=> {
                storageUtils.removeUser();
                memoryUtils.user = {};
                this.props.history.replace('/login')
            },
            onCancel() {
              
            },
          })
    }
    /*
    第一次render()之后执行一次
    一般在此执行异步操作：发ajax请求/启动定时器
     */
    componentDidMount(){
        //获取当前时间
        this.getTime()
        //获取当前天气
        this.getWeather()
        
    }
    /*当前组件卸载之前调用 */
    componentWillUnmount(){
        //清除定时器
        clearInterval(this.interval )
    }
    render(){
        const {currenTime,dayPictureUrl,weather} = this.state;
        const title = this.getTitle() 
        const user = memoryUtils.user
        return(
            <div className="header">
                <div className="header-top">
                    <span>欢迎您,{user.userName}</span>
                    
                    <Button type="primary" size='small'  onClick={this.logout}>退出</Button>
                    
                </div>
                <div className='header-bottom'>
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{currenTime}</span>
                        <img src={dayPictureUrl} alt='天气'></img>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Top)