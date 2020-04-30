import React, { Component } from "react";
import { Form, Input, Button, message, Tree, Row, Col } from 'antd'
import { menuList } from '../../../../config/menuConfig';
import { reqUpdateRole } from "../../../../api";
import memoryUtils from "../../../../utils/memoryUtils";
const treeData = [{
    title: '后台权限',
    key: '/admin',
    children: menuList
}]
export default class EditRole extends Component {
    constructor(props) {
        super(props)
        const { menu } = this.props.role
        this.state = {
            checkedKeys: menu
        }
    }
    //接收父组件属性前
    componentWillReceiveProps(nextProps) {
        const { menu } = nextProps.role
        this.setState({ checkedKeys: menu })
    }
    onCheck = (checkedKeys, info) => {
        this.setState({ checkedKeys })
    };
    updateRole = async() =>{
        const role = this.props.role
        role.menu = this.state.checkedKeys
        role.authTime = new Date()
        role.authName = memoryUtils.user.name
        const res = await reqUpdateRole(role)
        if(res.data.data.id){
            message.success("修改权限成功")
            this.props.hideEditModal()
            this.props.getDate(1,10)
        }else{
            message.success("修改权限失败")
        }
    }
    render() {
        const { checkedKeys } = this.state
        const { role } = this.props
        return (<div><Form>
            <Form.Item label="角色名">
                <Input value={role.name} disabled />
            </Form.Item>
            </Form>
            <Tree
                checkable
                checkedKeys={checkedKeys}
                defaultExpandAll={true}
                onCheck={this.onCheck}
                treeData={treeData}
                
            />
            <Row gutter={30} style={{marginTop:"20px"}}>
                <Col offset={1}>
                <Button type="primary" onClick={this.updateRole}>
                    提交
                </Button>
                </Col>
                <Col>
                <Button htmlType="button" onClick={this.props.hideEditModal}>
                    取消
                </Button>
                </Col>
                
            </Row>
            
        </div>)
    }
}