import React, { Component } from 'react'
import memoryUtils from '../../../../utils/memoryUtils'
import { Alert, Tabs, Button ,Modal} from 'antd'
import FCheck from './fCheck';
import UFCheck from './ufCheck';
import { reqOrg, reqDictType } from '../../../../api';
import AddUFCheck from './addUFCheck';
const { TabPane } = Tabs;
export default class Check extends Component {
  state = {
    org: {},
    dict: {},
    img: [],
    addVisible: false,
    refresh:0,
  }
  componentDidMount = () => {
    let typeCodes = ["type", "check","grade","result"]
    this.getDict(typeCodes)
    this.getOrg()
  }
  getOrg = async () => {
    const user = memoryUtils.user
    if (user.org) {
      const res = await reqOrg(user.org)
      if (res.data.data.id) {
        const org = res.data.data
        this.setState({ org })
      }
    }
  }
  getDict = async (typeCode) => {
    const res = await reqDictType(typeCode)
    const dict = res.data.data
    this.setState({ dict })
  }
  addRefresh = () =>{
    const refresh = this.state.refresh
    this.setState({refresh:refresh+1})
  }
  getDictValue = (name, id) => {
    const { dict } = this.state
    if (dict[name] && Array.isArray(dict[name])) {
      const result = dict[name].find(item => item.valueId === id)
      if (result) {
        return result.valueName
      } else {
        return id
      }
    }
  }
  render() {
    const user = memoryUtils.user
    const { org, dict ,addVisible,refresh} = this.state
    const operations = org.staffProduce ? (<Button type="primary" onClick={() => this.setState({ addVisible: true })}>新增待办</Button>) : ("")
    return (
      <div>
        <Modal
          title="新增待办"
          visible={addVisible}
          bodyStyle={{ backgroundColor: "white" }}
          footer={null}
          onCancel={() => this.setState({ addVisible: false })}
        >
          <AddUFCheck dict={dict} addRefresh={this.addRefresh}  hideModal={() => this.setState({ addVisible: false })}></AddUFCheck>
        </Modal>
        {user.org ? (
          <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
            <TabPane tab="待办" key="1">
              <UFCheck addRefresh={this.addRefresh} refresh={refresh} dict={dict}></UFCheck>
            </TabPane>
            <TabPane tab="已完成" key="2">
              <FCheck refresh={refresh} dict={dict}></FCheck>
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