import React from "react";
import {DatabaseOutlined,InsertRowRightOutlined,FileTextOutlined,GoldOutlined, ClusterOutlined,SettingOutlined,TrademarkOutlined,
    SafetyCertificateOutlined,StockOutlined,AreaChartOutlined, InsertRowLeftOutlined,UserOutlined, DesktopOutlined, TeamOutlined, CloudOutlined, ToolOutlined, 
    SolutionOutlined,SlidersOutlined,LineChartOutlined,PieChartOutlined,FireOutlined,BarChartOutlined, MessageOutlined, EyeInvisibleOutlined, ExperimentOutlined, BankOutlined } from '@ant-design/icons';
import User from "../components/info/user";
import Msg from "../components/info/msg";
import UserPassword from "../components/info/password";
import Plant from "../pages/admin/tea/plant";
import Process from "../pages/admin/tea/process";
import Storage from "../pages/admin/tea/storage";
import Check from "../pages/admin/tea/check";
import ProduceChart from "../pages/admin/chart/produceChart";
import NewsChart from "../pages/admin/chart/newsChart";
import OrgChart from "../pages/admin/chart/orgChart";
import StaffChart from "../pages/admin/chart/staffChart";
import Server from "../pages/admin/chart/server";
import OrgInfo from "../pages/admin/orgSys/orgInfo";
import OrgStaff from "../pages/admin/orgSys/orgStaff";
import OrgProduce from "../pages/admin/orgSys/orgProduce";
import OrgNews from "../pages/admin/orgSys/orgNews";
import Org from "../pages/admin/sys/org";
import Staff from "../pages/admin/sys/staff";
import Role from "../pages/admin/sys/role";
import Produce from "../pages/admin/sys/produce";
import Dict from "../pages/admin/sys/dict";
import NewsManage from "../pages/admin/sys/news";
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
                component:User,
                isPublic: true,
            },
            {
                title: '消息中心',
                key: '/admin/info/msg',
                icon: <MessageOutlined />,
                component:Msg,
                isPublic: true,
            },
            {
                title: '修改密码',
                key: '/admin/info/password',
                icon: <EyeInvisibleOutlined />,
                component:UserPassword,
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
                icon: <CloudOutlined />,
                component:Plant
            },
            {
                title: '加工阶段',
                key: '/admin/process',
                icon: <ToolOutlined />,
                component:Process,
            },
            {
                title: '仓储阶段',
                key: '/admin/storage',
                icon: <BankOutlined />,
                component:Storage,
            },
            {
                title: '检测阶段',
                key: '/admin/check',
                icon: <ExperimentOutlined />,
                component:Check,
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
                icon: <AreaChartOutlined />,
                component:ProduceChart,
            },
            {
                title: '资讯分析',
                key: '/admin/newsChart',
                icon: <StockOutlined />,
                component:NewsChart,
            },
            {
                title: '机构分析',
                key: '/admin/orgChart',
                icon: <LineChartOutlined />,
                component:OrgChart,
            },
            {
                title: '用户分析',
                key: '/admin/staffChart',
                icon: <PieChartOutlined />,
                component:StaffChart,
            },  
            {
                title: '系统监控',
                key: '/admin/server',
                icon: <SlidersOutlined />,
                component:Server,
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
                icon: <DesktopOutlined />,
                component:OrgInfo,
            },
            {
                title: '机构用户',
                key: '/admin/orgStaff',
                icon: <TeamOutlined />,
                component:OrgStaff,
            },
            {
                title: '机构产品',
                key: '/admin/orgProduce',
                icon: <InsertRowLeftOutlined />,
                component:OrgProduce,
            },
            {
                title: '机构资讯',
                key: '/admin/orgNews',
                icon: <FireOutlined />,
                component:OrgNews,
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
                icon: <GoldOutlined />,
                component:Org,
            },
            {
                title: '用户管理',
                key: '/admin/staff',
                icon: <TeamOutlined />,
                component:Staff,
            },
            {
                title: '角色管理',
                key: '/admin/role',
                icon: <TrademarkOutlined />,
                component:Role,
            },
            {
                title: '产品管理',
                key: '/admin/produce',
                icon: <InsertRowRightOutlined />,
                component:Produce,
            },
            {
                title: '字典管理',
                key: '/admin/dict',
                icon: <DatabaseOutlined />,
                component:Dict,
            },
            {
                title: '资讯管理',
                key: '/admin/news',
                icon: <FileTextOutlined />,
                component:NewsManage,
            },
        ]
    },
]
const routeList = [
    '/admin/info',
    '/admin/info/user',
    '/admin/info/msg',
    '/admin/info/password',
    '/admin/tea',
    '/admin/plant',
    '/admin/process',
    '/admin/storage',
    '/admin/check',
    '/admin/chart',
    '/admin/produceChart',
    '/admin/newsChart',
    '/admin/orgChart',
    '/admin/staffChart',
    '/admin/server',
    '/admin/orgSys',
    '/admin/orgInfo',
    '/admin/orgStaff',
    '/admin/orgProduce',
    '/admin/orgNews',
    '/admin/sys',
    '/admin/org',
    '/admin/staff',
    '/admin/role',
    '/admin/produce',
    '/admin/dict',
    '/admin/news',
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