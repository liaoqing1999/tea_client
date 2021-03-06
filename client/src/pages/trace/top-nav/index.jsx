import React,{Component} from 'react'
import './index.less'
import {Link , withRouter} from 'react-router-dom'
import { Menu} from 'antd';
import { topMenu } from '../../../config/menuConfig';

const { SubMenu } = Menu;
 class TopNav extends Component{
   
    /*根据menuList的数据数组生成对应的标签数组 
    使用map()+递归调用
    */
    getMenuNodes =(menuList) => {
        return menuList.map(item =>{
            if(!item.children){
                return (
                    <Menu.Item key = {item.key}>
                        <Link to={item.key}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else{
                return (
                    <SubMenu key={item.key} title={
                        <span>
                            {item.icon}
                            <span>{item.title}</span>
                        </span>
                    }>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    /*使用reduce()+递归调用 */
    getMenuNodes_r = (menuList) =>{
         //得到当前路由路径
        const path = this.props.location.pathname
        return menuList.reduce((pre,item)=>{
            if(!item.children){
                pre.push((
                        <Menu.Item key = {item.key}>
                        <Link to={item.key}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                        </Menu.Item>
                    ))
            }else{
                const citem=item.children.find(citem => citem.key===path)
                if(citem){
                    this.openKey = item.key;
                }
                
                pre.push((
                        <SubMenu key={item.key} title={
                            <span>
                                {item.icon}
                                <span>{item.title}</span>
                            </span>
                        }>
                            {this.getMenuNodes_r(item.children)}
                        </SubMenu>
                    ))
            }
            return pre
        },[])
    }
    //第一次render()之前执行一次
    //为第一个render()准备数据（必须同步）
    UNSAFE_componentWillMount(){
        this.menuNodes =  this.getMenuNodes_r(topMenu);
    }
    render(){
        //得到当前路由路径
        const path = this.props.location.pathname
       
        return(
            <div className="top-nav">
                <Menu
                    style={{lineHeight: "38px"}}
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]}
                    mode="inline"
                    theme="light"
                    mode="horizontal"
                    >
                    {
                       this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

/*
withRouter高阶组件
包装非路由组件，返回一个新的组件
新的组件 向非路由组件传递3个属性：history，location，match
*/
export default withRouter(TopNav)