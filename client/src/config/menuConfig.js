import React,{ Component } from "react";
import { UserOutlined, BookOutlined,PieChartOutlined,RadarChartOutlined,LineChartOutlined,AreaChartOutlined,BarChartOutlined,DesktopOutlined } from '@ant-design/icons';
const menuList = [
    {
        title:'图书管理',
        key:'/bookManage',
        icon:<BookOutlined />,
    },
    {
        title:'借阅管理',
        key:'/borrowManage',
        icon:<DesktopOutlined />,
    },
    {
        title:'个人信息管理',
        key:'/infoManage',
        icon:<UserOutlined />,
    },
    {
        title:'统计分析',
        key:'/chart',
        icon:<PieChartOutlined />,
        children:[
            {
                title:'各时期图书馆藏量',
                key:'/bookStore',
                icon:<BarChartOutlined />,
            },
            {
                title:'各时期分类馆藏量',
                key:'/typeStore',
                icon:<AreaChartOutlined />,
            },
            {
                title:'读者数量变化趋势',
                key:'/readerNumber',
                icon:<LineChartOutlined />,
            },
            {
                title:'已借借阅比例分布',
                key:'/borrowRatio',
                icon:<RadarChartOutlined />,
            }
        ]
    }
]

export default menuList;