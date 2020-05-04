import React, { Component } from 'react'
import { Tabs } from 'antd'
import UnAuthOrg from './unAuthOrg';
import AuthOrg from './authOrg';
const { TabPane } = Tabs;
export default class Org extends Component {
    render() {
        return (
            <div>
                <Tabs>
                    <TabPane tab="待审核" key="1">
                        <UnAuthOrg></UnAuthOrg>
                    </TabPane>
                    <TabPane tab="已审核" key="2">
                        <AuthOrg></AuthOrg>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}