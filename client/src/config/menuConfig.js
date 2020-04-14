import React from "react";
import {TrademarkOutlined, UserOutlined,DesktopOutlined, TeamOutlined,CloudOutlined,ToolOutlined, SolutionOutlined, MessageOutlined, EyeInvisibleOutlined, ExperimentOutlined, TransactionOutlined, BankOutlined } from '@ant-design/icons';

const menuList = [
    {
        title: '个人中心',
        key: '/admin/info',
        icon: <UserOutlined />,
        children: [
            {
                title: '基础信息',
                key: '/admin/info/user',
                icon: <SolutionOutlined />,
            },
            {
                title: '消息中心',
                key: '/admin/info/msg',
                icon: <MessageOutlined />,
            },
            {
                title: '修改密码',
                key: '/admin/info/password',
                icon: <EyeInvisibleOutlined />,
            }
        ]
    },
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
    {
        title: '机构管理',
        key: '/admin/org',
        icon: <DesktopOutlined />
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
    }

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

export { menuList, topMenu };