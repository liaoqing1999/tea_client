import React, { Component } from 'react'
import { Form, Input, Button, Row, Col, Descriptions, message, Select, Modal } from 'antd';
import memoryUtils from '../../../../utils/memoryUtils';
import {  reqOrgUpdate } from '../../../../api';
import sessionUtils from '../../../../utils/sessionUtils';
import Place from '../../../../components/place';

const { Option } = Select;
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
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
};
export default class OrgInfo extends Component {
    state = {
        fileList: [],
        file: [],
        user: memoryUtils.user,
        org: sessionUtils.get('org'),
        img: null,
    }
    onFinish = async values => {
        const {org} = this.state
        if (Array.isArray(values.place)) {
            values.place= values.place.join("-");
        }
        org.corporation = values.corporation
        org.phone = values.phone
        org.license = values.license
        org.email = values.email
        org.remark = values.remark
        org.description = values.description
        org.staffProduce = values.staffProduce
        const res = await reqOrgUpdate(org)
        if(res.data.data){
            message.success("修改成功")
            sessionUtils.remove('org')
            sessionUtils.save('org',res.data.data)
        }
    };
    getImg = (imgList) => {
        if (Array.isArray(imgList)) {
            return imgList.reduce((pre, item, index) => {
                pre.push((
                    <img key={index} onClick={() => this.setState({ previewImage: item, previewVisible: true })} alt="" style={{ margin: "0 10px", height: "100px" }} src={global.ipfs.uri + item}></img>
                ))
                return pre
            }, [])
        } else {
            return <img alt="" onClick={() => this.setState({ previewImage: imgList, previewVisible: true })} style={{ margin: "0 10px", height: "100px" }} src={global.ipfs.uri + imgList}></img>
        }
    }
    render() {
        const { org } = this.state
        return (
            <div className="top">
                <Form {...layout} name="org" onFinish={this.onFinish} validateMessages={validateMessages}
                    initialValues={{
                        'name': org.name,
                        "phone": org.phone,
                        "corporation": org.corporation,
                        "license": org.license,
                        "email": org.email,
                        "place": org.place ? org.place.split("-") : "",
                        "remark": org.remark,
                        "staffProduce": org.staffProduce,
                        "description": org.description
                    }}>
                    <Row>
                        <Col span={8}>
                            <Form.Item name='name' label="机构名" rules={[{ required: true }]}>
                                <Input disabled />
                            </Form.Item>
                            <Form.Item name='corporation' label="机构法人">
                                <Input />
                            </Form.Item>
                            <Form.Item name='phone' label="机构电话" rules={[{ pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"), message: '请输入正确的手机号' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name='license' label="机构生产许可证编号">
                                <Input />
                            </Form.Item>
                            <Form.Item name='place' label="地点" >
                                <Place></Place>
                            </Form.Item>
                            <Form.Item name='email' label="电子邮箱" rules={[{ type: 'email' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name='staffProduce' label="允许非管理员新建产品">
                                <Select placeholder="请选择" >
                                    <Option value={true}>是</Option>
                                    <Option value={false}>否</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name='description' label="描述信息" >
                                <Input.TextArea autoSize />
                            </Form.Item>
                            <Form.Item name='remark' label="备注" >
                                <Input.TextArea autoSize />
                            </Form.Item>
                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
                                <Button type="primary" htmlType="submit">
                                    提交修改
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col span={10} offset={3}>
                            <Descriptions title="机构信息" column={1}>
                                <Descriptions.Item label="机构id">{org.id}</Descriptions.Item>
                                <Descriptions.Item label="商标">
                                    {this.getImg(org.trademark)}
                                </Descriptions.Item>
                                <Descriptions.Item label="组织机构代码证">
                                    {this.getImg(org.codePermit)}
                                </Descriptions.Item>
                                <Descriptions.Item label="营业执照">
                                    {this.getImg(org.permit)}
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </Form>
                <Modal bodyStyle={{ backgroundColor: "white" }} visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
                    <img alt="example" style={{ width: '100%' }} src={global.ipfs.uri +this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}