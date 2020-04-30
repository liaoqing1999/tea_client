import React,{Component} from 'react'
import memoryUtils from '../../../../utils/memoryUtils'
import { Alert,Tabs  } from 'antd'
const { TabPane } = Tabs;
export default class Storage extends Component{
    render(){
        const user = memoryUtils.user
        return (
            <div>
                {user.org ? (
                    <Tabs defaultActiveKey="1" onChange={this.onChange}>
                    <TabPane tab="产品" key="1">
                      Content of Tab Pazne 1
                    </TabPane>
                    <TabPane tab="茶叶" key="2">
                      Content of Tab Pane 2
                    </TabPane>
                  </Tabs>
                ) :
                    (<Alert
                        message="警告"
                        description="您不属于任何机构！."
                        type="warning"
                        showIcon
                    />)}
            </div>
        )
    }
}