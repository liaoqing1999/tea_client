import React from "react";
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

const topMenu = [
    {
        title:'首页',
        key:'/'
    },
    {
        title:'品牌',
        key:'/main/brand'
    },
    {
        title:'资讯',
        key:'/main/news'
    },
    {
        title:'商城',
        key:'/main/shop'
    },
    {
        title:'入住',
        key:'/main/join'
    },
    {
        title:'关于',
        key:'/main/about'
    },
    {
        title:'联系',
        key:'/main/contact'
    }
]

export  {menuList,topMenu};