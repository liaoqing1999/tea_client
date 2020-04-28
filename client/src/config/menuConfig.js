import React from "react";
import {DatabaseOutlined,InsertRowRightOutlined,FileTextOutlined,GoldOutlined, ClusterOutlined,SettingOutlined,TrademarkOutlined,
    SafetyCertificateOutlined,StockOutlined,AreaChartOutlined, InsertRowLeftOutlined,UserOutlined, DesktopOutlined, TeamOutlined, CloudOutlined, ToolOutlined, 
    SolutionOutlined,LineChartOutlined,PieChartOutlined,FireOutlined,BarChartOutlined, MessageOutlined, EyeInvisibleOutlined, ExperimentOutlined, TransactionOutlined, BankOutlined } from '@ant-design/icons';

const menuList = [
    {
        title: '个人中心',
        key: '/admin/info',
        icon: <UserOutlined />,
        isPublic: true,
        children: [
            {
                title: '基础信息',
                key: '/admin/info/user',
                icon: <SolutionOutlined />,
                isPublic: true,
            },
            {
                title: '消息中心',
                key: '/admin/info/msg',
                icon: <MessageOutlined />,
                isPublic: true,
            },
            {
                title: '修改密码',
                key: '/admin/info/password',
                icon: <EyeInvisibleOutlined />,
                isPublic: true,
            }
        ]
    },
    {
        title: '茶叶产品',
        key: '/admin/tea',
        icon: <SafetyCertificateOutlined />,
        children: [
            {
                title: '种植阶段',
                key: '/admin/plant',
                icon: <CloudOutlined />
            },
            {
                title: '加工阶段',
                key: '/admin/process',
                icon: <ToolOutlined />,
            },
            {
                title: '仓储阶段',
                key: '/admin/storage',
                icon: <BankOutlined />,
            },
            {
                title: '检测阶段',
                key: '/admin/check',
                icon: <ExperimentOutlined />,
            },
            {
                title: '售卖阶段',
                key: '/admin/sale',
                icon: <TransactionOutlined />,
            },
        ]
    },
    {
        title: '统计分析',
        key: '/admin/chart',
        icon: <BarChartOutlined />,
        children: [
            {
                title: '产品分析',
                key: '/admin/produceChart',
                icon: <AreaChartOutlined />
            },
            {
                title: '资讯分析',
                key: '/admin/newsChart',
                icon: <StockOutlined />
            },
            {
                title: '机构分析',
                key: '/admin/orgChart',
                icon: <LineChartOutlined />
            },
            {
                title: '用户分析',
                key: '/admin/staffChart',
                icon: <PieChartOutlined />
            },  
        ]
    },
    {
        title: '系统管理',
        key: '/admin/orgSys',
        icon: <ClusterOutlined />,
        children: [
            {
                title: '机构信息',
                key: '/admin/orgInfo',
                icon: <DesktopOutlined />
            },
            {
                title: '机构用户',
                key: '/admin/staff',
                icon: <TeamOutlined />
            },
            {
                title: '机构产品',
                key: '/admin/produce',
                icon: <InsertRowLeftOutlined />
            },
            {
                title: '机构资讯',
                key: '/admin/news',
                icon: <FireOutlined />
            },  
        ]
    },
    {
        title: '平台管理',
        key: '/admin/sys',
        icon: <SettingOutlined />,
        children: [
            {
                title: '机构管理',
                key: '/admin/org',
                icon: <GoldOutlined />
            },
            {
                title: '用户管理',
                key: '/admin/staff',
                icon: <TeamOutlined />
            },
            {
                title: '角色管理',
                key: '/admin/role',
                icon: <TrademarkOutlined />
            },
            {
                title: '产品管理',
                key: '/admin/produce',
                icon: <InsertRowRightOutlined />
            },
            {
                title: '字典管理',
                key: '/admin/dict',
                icon: <DatabaseOutlined />
            },
            {
                title: '资讯管理',
                key: '/admin/news',
                icon: <FileTextOutlined />
            },
        ]
    },
]
const routeList = [
    '/admin/info',
    '/admin/info/user',
    '/admin/info/msg',
    '/admin/info/password',
    '/admin/plant',
    '/admin/process',
    '/admin/storage',
    '/admin/check',
    '/admin/sale',
    '/admin/org',
    '/admin/staff',
    '/admin/role'
]
const topMenu = [
    {
        title: '首页',
        key: '/'
    },
    {
        title: '品牌',
        key: '/main/brand'
    },
    {
        title: '资讯',
        key: '/main/news'
    },
    {
        title: '商城',
        key: '/main/shop'
    },
    {
        title: '入住',
        key: '/main/join'
    },
    {
        title: '关于',
        key: '/main/about'
    },
    {
        title: '联系',
        key: '/main/contact'
    }
]

export { menuList, topMenu,routeList };