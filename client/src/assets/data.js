import React from "react";
import {Typography,Timeline,Button} from 'antd';
const { Title, Paragraph, Text } = Typography;
const trace ={
    about:{
        title:["系统简介","平台优势","大事记"],
        mainTitle:"关于我们",
        content:[
            <Typography style={{textIndent:"2em",marginTop:"10px"}}>
                <Title>介绍</Title>
                <Paragraph>
                茶叶追溯防伪系统是充分利用互联网和移动互联网技术，
                实现对茶叶产品从基地种植、鲜叶采摘、原料粗制、加工包装、仓储管理、运输流转的全过程信息化动态追踪溯，
                为每一件商品建立唯一-的“电子身份证”--商品追溯码，
                消费者可以通过微信平台直接扫描后识别真伪，
                并查询到在该产品从种植到流转过程中各阶段的主要信息，
                追溯每件产品的来龙去脉，从而从根本上实现杜绝假冒、方便消费者识别的同事，
                实现产品品牌随着产品的销售流通而面向经销商和消费者传播的目的，通过产品追溯体系，
                让自己的产品在鱼龙混杂的市场环境中脱颖而出，从根本上建立可信度，提升品牌形象，为消费者负责。
                </Paragraph>
                <Paragraph>
                您可以注册来了解更多详情和使用技巧，
                <Text strong>
                    这不会对你造成任何损害。
                </Text>
                </Paragraph>
                <Title style={{marginTop: "0px"}}>使用手册</Title>
                <Paragraph>
                我们提供完善的使用手册、帮助说明和其他资源文件，来帮助用户快速使用系统。
                </Paragraph>
                <Paragraph>
                <ul>
                    <li>
                    <Button type="link" onClick={() => {}}>使用手册</Button>
                    </li>
                    <li>
                    <Button type="link" onClick={() => {}}>帮助说明</Button>
                    </li>
                    <li>
                    <Button type="link" onClick={() => {}}>其他资源文件</Button>
                    </li>
                </ul>
                </Paragraph>
            </Typography>,
            <Typography style={{textIndent:"2em",marginTop:"10px"}}>
                <Title>技术优势</Title>
                <Paragraph>
                后端技术： 
                <Text strong>
                    SpringBoot,Maven,IPFS,
                </Text>
                </Paragraph>
                <Paragraph>
                前端技术： 
                <Text strong>
                    React,Antd,Web3,Axios
                </Text>
                </Paragraph>
                <Paragraph>
                数据库技术： 
                <Text strong>
                MongDB,Ethereum,Solidity
                </Text>
                </Paragraph>
                <Title style={{marginTop: "0px"}}>湖南工商大学</Title>
                <Paragraph>
                湖南工商大学位于湖南省长沙市，是一所以经济学、管理学为主，
                涵盖经、管、工、理、法、文、艺等学科的省属全日制普通高等学校，
                入选湖南省2011计划、“十三五”应用型本科产教融合发展工程、湖南省国内一流学科建设高校，
                是教育部本科教学工作水平评估优秀高校、博士学位授予立项建设单位、中国首批深化创新创业教育改革示范高校、全国高校实践育人创新创业基地、全国创新创业典型经验50强高校。
                </Paragraph>
            </Typography>,
            <div>
            <span style={{ fontSize: "20px", lineHeight: "60px",margin:"0 2px"}}>做大事专用span</span>       
            <Timeline>
                <Timeline.Item>2019-10-31   选题-基于区块链的茶叶溯源系统</Timeline.Item>
                <Timeline.Item>2019-12-25 开题答辩</Timeline.Item>
                <Timeline.Item>2020-1-5  系统建立</Timeline.Item>
                <Timeline.Item>2020-2-30  本页被创建</Timeline.Item>
            </Timeline></div>
            
        ]
    },
    contact:{
        title:["联系我们"],
        mainTitle:"联系",
        content:[
            <Typography style={{textIndent:"2em",marginTop:"10px"}}>
                <Title>联系我们</Title>
                <Paragraph>
                电话： <Text strong>
                    8080888
                </Text>
                </Paragraph>
                <Paragraph>
                手机：
                <Text strong>
                    1555555555
                </Text>
                </Paragraph>
                <Paragraph>
                QQ：
                <Text strong>
                    160000000
                </Text>
                </Paragraph>
                
                <Paragraph>
                邮箱：
                <Text strong>
                    160000000@qq.com
                </Text>
                </Paragraph>
                <Paragraph>
                地址：
                <Text strong>
                    湖南省长沙市岳麓区
                </Text>
                </Paragraph>
            </Typography>
        ]
    }
}

const admin ={

}

const login ={

}


export  {login,admin,trace};