import React, { Component } from 'react'
import { Avatar, Form, Upload, Input, Button, Row, Col, Descriptions, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import memoryUtils from '../../../utils/memoryUtils';
import { reqOrg, reqUpdateStaff } from '../../../api';
import { addImg } from '../../../api/ipfs';
import storageUtils from '../../../utils/storageUtils';
const validateMessages = {
    required: '${label} 是必须的!',
    types: {
        email: '${label} 格式不正确',
        number: '${label} 格式不正确!',
    },
    number: {
        range: '${label}必须在 ${min} —— ${max}之间',
    },
};
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
export default class User extends Component {
    state = {
        fileList: [],
        file: [],
        user: memoryUtils.user,
        img:null,
    }
    onFinish =async values => {
        const user = this.state.user
        user.name = values.name
        user.realName = values.realName
        user.phone = values.phone
        user.card = values.card
        user.email = values.email
        if(this.state.img) user.img = this.state.img
        const res = await reqUpdateStaff(user);
        if(res.data.data){
            storageUtils.removeUser()
            storageUtils.savaUser(res.data.data)
            message.success("修改成功")
        }
        
    };
    beforeUpload = file => {
        this.setState({ file: file })
        this.setState({ fileList: [file] });
        let reader = new FileReader();
        reader.readAsArrayBuffer(file)
        reader.onloadend = async (e) => {
            // 上传数据到IPFS
           let hash = await addImg(reader);
           this.setState({img:hash})
        }
        return false;
    }
    onClick = async () => {
        const user = this.state.user
        if (user.org) {
            const res = await reqOrg(user.org)
            const org = res.data.data
            this.setState({ org: org })
        }
    }
    render() {
        const { fileList ,user,org} = this.state
       
        return (
            <div className="top">
                <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}
                    initialValues={{
                        'name': user.name,
                        'realName': user.realName,
                        'phone': user.phone,
                        'card': user.card,
                        'work': user.work,
                        'org': user.org,
                        'email': "1609614437@qq.com"
                    }}>
                    <Row>
                        <Col span={8}>
                            <Form.Item name='name' label="用户名" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name='email' label="邮箱" rules={[{ type: 'email' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name='realName' label="真实姓名">
                                <Input />
                            </Form.Item>
                            <Form.Item name='phone' label="手机号码" rules={[{ required: true }, { pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"), message: '请输入正确的手机号' }]} hasFeedback>
                                <Input />
                            </Form.Item>
                            <Form.Item name='card' label="身份证号">
                                <Input />
                            </Form.Item>
                            <Form.Item name='work' label="身份">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item name='org' label="所属机构">
                                <Input disabled />

                            </Form.Item>

                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                <Button type="primary" htmlType="submit">
                                    提交修改
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col style={{ textAlign: "center" }} offset={2}  span={3}>
                            <Row justify="center">
                                {
                                    this.state.img ?
                                        (<Avatar size={80} src={global.ipfs.uri + this.state.img} />):
                                            ( user.img?(<Avatar size={80} src={global.ipfs.uri + user.img} />) : (<Avatar size={80} icon={<UserOutlined />} />))
                                       
                                }
                            </Row>
                            <Upload
                                beforeUpload={this.beforeUpload}
                                fileList={fileList}
                                showUploadList={false}
                            >
                                <Button style={{ marginTop: "15px" }}>更改头像</Button>
                            </Upload>
                            {user.org?( <Row justify="center">
                                <Button style={{ marginTop: "15px" }} type="link" onClick={this.onClick}>查看机构详情</Button>
                            </Row>):(<div></div>)}
                           
                        </Col>
                        <Col  span={10} offset={1}>
                            {org ? (<Descriptions title="机构信息" column={1}>
                            <Descriptions.Item label="机构id">{org.id}</Descriptions.Item>
                                <Descriptions.Item label="机构名">{org.name}</Descriptions.Item>
                                <Descriptions.Item label="商标">
                                    <img alt="商标" style={{ height: "60px" }} src={global.ipfs.uri + org.trademark}></img>
                                </Descriptions.Item>
                                <Descriptions.Item label="联系电话">{org.phone} </Descriptions.Item>
                                <Descriptions.Item label="描述">{org.description}</Descriptions.Item>
                                <Descriptions.Item label="所在地点">
                                    {org.place}
                                </Descriptions.Item>
                            </Descriptions>) : (<div></div>)}
                        </Col>
                    </Row>                
                </Form>
            </div>
        )
    }
}