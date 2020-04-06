import React, { Component } from 'react'
import SearchTea from '../searchtea';
import { Tabs, message } from 'antd';
import { Modal, Typography, Steps, Form, Checkbox, Input, Tooltip, Upload, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Place from '../../../components/place';
import { reqCheckVerify } from '../../../api';
import { addImg } from '../../../api/ipfs';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;
const title = ["入住条件", "入住流程", "快速入住", "客服咨询"];

const content = [
    "在快速入住填写相关信息，并上传企业的营业执照和必要文件，然后发出申请",
    "我们的管理员在接到申请后，会在24小时内审核并处理您的申请",
    "如果审核通过的话，那么恭喜您，已经成为了我们的会员，你所在的公司的管理员账号即为申请时填写的账号"
]
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
const validateMessages = {
    required: '${label} 不能为空!',
    types: {
        email: '${label} 必须为邮箱格式!',
        number: '${label} 不是一个合法的数字!',
    },
    number: {
        range: '${label} 必须在 ${min} 到 ${max}之间',
    },
};
const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};
const normPlace = e => {
    console.log('Place:', e);
    if (Array.isArray(e)) {
        return e.join("-");
    }
    return e
};
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        console.log(reader)
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export default class Join extends Component {
    onFinish = async values => {
        console.log(values);
        const verifyResult = await reqCheckVerify(values.verify);
        if (verifyResult.data.data === "success") {
            const permit = this.ipfsUpload(this.state.permitFile)
            const codePermit = this.ipfsUpload(this.state.codePermitFile)
            console.log(permit)
            console.log(codePermit)
        } else {
            message.error("验证码错误！请重试")
            this.getVerify()
        }
    };
    ipfsUpload = async (fileList) => {
        let hash = []
        if (Array.isArray(fileList)) {
            for (let i = 0; i < fileList.length; i++) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(fileList[i])
                reader.onloadend = async (e) => {
                    // 上传数据到IPFS
                    hash[i] = await addImg(reader);
                }
            }
        }else{
            let reader = new FileReader();
            reader.readAsArrayBuffer(fileList)
            reader.onloadend = async (e) => {
                // 上传数据到IPFS
                hash[hash.length-1] = await addImg(reader);
            }
        }
        return hash
    }
    state = {
        text: title[0],
        current: 0,
        verify: "",
        checked: false,
        permitFileList: [],
        permitFile:[],
        codePermitFile:[],
        codePermitFileList: [],
        previewVisible: false,
        previewImage: '',
    }
    onChange = (activeKey) => {
        this.setState({
            text: title[activeKey - 1]
        })
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ permitFileList: fileList });
    onRemove = (file) => {
        this.setState(state => {
            const index = state.permitFileList.indexOf(file);
            const newFileList = state.permitFileList.slice();
            newFileList.splice(index, 1);
            return {
                permitFileList: newFileList,
            };
        });
    }
    beforeUpload = file => {
        const permitFile = this.state.permitFile;
        permitFile.push(file);
        this.setState({permitFile:permitFile})
        this.setState(state => ({
            permitFileList: [...state.permitFileList, file],
        }));
        return false;
    }
    handleChange1 = ({ fileList }) => this.setState({ codePermitFileList: fileList });
    onRemove1 = (file) => {
        this.setState(state => {
            const index = state.codePermitFileList.indexOf(file);
            const newFileList = state.codePermitFileList.slice();
            newFileList.splice(index, 1);
            return {
                codePermitFileList: newFileList,
            };
        });
    }
    beforeUpload1 = file => {
        const codePermitFile = this.state.codePermitFile;
        codePermitFile.push(file);
        this.setState({codePermitFile:codePermitFile})
        this.setState(state => ({
            codePermitFileList: [...state.codePermitFileList, file],
        }));
        return false;
    }
    agreement = (e) => {
        this.setState({ checked: e.target.checked })
    }
    getVerify = () => {
        this.setState({ verify: Math.random() })
    }
    onStepChange = current => {
        this.setState({ current });
    };
    render() {
        const { previewVisible, previewImage, codePermitFileList, permitFileList } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传证件</div>
            </div>
        );
        const { current } = this.state;
        return (
            <div className="about">
                <div className="about-top">
                    <div className="about-top-left">
                        <h1>入住</h1>
                        <span>/</span>
                        <span>{this.state.text}</span>
                    </div>
                    <div className="about-top-right">
                        <SearchTea></SearchTea>
                    </div>
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <div className="about-center">
                    <Tabs defaultActiveKey="1" tabPosition="left" onChange={this.onChange}>
                        <TabPane tab={title[0]} key="1">
                            <Typography style={{ textIndent: "2em", marginTop: "10px" }}>
                                <Title>入住条件</Title>
                                <Paragraph>
                                    <Text strong style={{ fontSize: "15px" }}>
                                        喝好茶溯源平台入驻条件：
                                    </Text>
                                </Paragraph>
                                <Paragraph>
                                    1、具有独立法人资格，且有良好的企业信誉；
                                </Paragraph>
                                <Paragraph>
                                    2、具有有效的食品生产许可证；
                                 </Paragraph>
                                <Paragraph>
                                    3、有自身品牌并且有一定的知名度；
                                </Paragraph>
                                <Paragraph>
                                    4、愿意将生产过程的真实记录及信息公布给消费者。
                                </Paragraph>
                            </Typography>
                        </TabPane>
                        <TabPane tab={title[1]} key="2" >
                            <Steps current={current} onChange={this.onStepChange} style={{ marginTop: "10px", marginBottom: "20px" }}>
                                <Step title="入住申请" description="填写入住申请的相关信息">
                                </Step>
                                <Step title="管理员审核" description="我们的管理员会对您的申请进行审核" />
                                <Step title="成为会员" description="恭喜您，成为了我们的会员" />
                            </Steps>
                            <div style={{ height: "250px" }}>{content[current]}</div>
                        </TabPane>
                        <TabPane tab={title[2]} key="3">
                            <Form style={{ marginTop: "10px", marginBottom: "20px" }} {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
                                <span style={{ lineHeight: "30px", textIndent: "1.5em", fontSize: "15px", display: "block", width: "100%", backgroundColor: '#efefef', margin: "10px 0px" }}>机构管理员信息</span>
                                <Form.Item name={['org', 'admin', 'name']} label="管理员账号" rules={[{ required: true }]} hasFeedback>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={['org', 'admin', 'password']} label="管理员密码" rules={[{ required: true }]} hasFeedback>
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item name="confirm" label="确认密码" dependencies={['org', 'admin', 'password']} hasFeedback
                                    rules={[{ required: true },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue(['org', 'admin', 'password']) === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('两次输入密码不一致!');
                                        },
                                    }),
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <span style={{ lineHeight: "30px", textIndent: "1.5em", fontSize: "15px", display: "block", width: "100%", backgroundColor: '#efefef', margin: "10px 0px" }}>企业信息</span>
                                <Form.Item name={['org', 'name']} label="企业名称" rules={[{ required: true }]} hasFeedback>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={['org', 'corporation']} label="法人" rules={[{ required: true }]} hasFeedback>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={['org', 'phone']} label="联系电话" rules={[{ required: true }, { pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"), message: '请输入正确的手机号' }]} hasFeedback>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={['org', 'description']} label="企业介绍" rules={[{ required: true }]} hasFeedback>
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item name={['org', 'license']} label="生产许可证编号" rules={[{ required: true }]} hasFeedback>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={['org', 'permit']} label="营业执照" valuePropName="fileList"
                                    getValueFromEvent={normFile} rules={[{ required: true }]} hasFeedback>
                                    <Upload
                                        onRemove={this.onRemove}
                                        beforeUpload={this.beforeUpload}
                                        listType="picture-card"
                                        fileList={permitFileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                    >
                                        {permitFileList.length >= 3 ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                                <Form.Item name={['org', 'codePermit']} label="组织机构代码证" valuePropName="fileList"
                                    getValueFromEvent={normFile} rules={[{ required: true }]} hasFeedback>
                                    <Upload
                                        onRemove={this.onRemove1}
                                        beforeUpload={this.beforeUpload1}
                                        listType="picture-card"
                                        fileList={codePermitFileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange1}
                                    >
                                        {codePermitFileList.length >= 3 ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                                <Form.Item name={['org', 'email']} label="邮箱" rules={[{ type: 'email' }]} hasFeedback>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={['org', 'place']} label="地区" valuePropName="place"
                                    getValueFromEvent={normPlace} rules={[{ required: true }]} hasFeedback>
                                    <Place></Place>
                                </Form.Item>
                                <Form.Item name={['org', 'remark']} label="备注" rules={[{ required: true }]} hasFeedback>
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item label="验证码" rules={[{ required: true }]} hasFeedback>
                                    <Form.Item name={['verify']} rules={[{ required: true, message: '验证码不能为空' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }}>
                                        <Input />
                                    </Form.Item>
                                    <Tooltip onClick={this.getVerify} placement="topLeft" title="看不清？点击更换" style={{ display: 'inline-block', width: 'calc(50% - 5px)' }}>
                                        <img alt="验证码" style={{ marginLeft: "15px", width: "100px", height: "30px" }} src={"http://127.0.0.1:8090/verify/getVerify?p=" + this.state.verify}></img>
                                    </Tooltip>
                                </Form.Item>
                                <Form.Item name="agreement" valuePropName="checked"
                                    rules={[
                                        { validator: (_, value) => value ? Promise.resolve() : Promise.reject('请勾选用户协议') },
                                    ]}
                                    wrapperCol={{
                                        xs: {
                                            span: 16,
                                            offset: 0,
                                        },
                                        sm: {
                                            span: 16,
                                            offset: 4,
                                        }
                                    }}
                                >
                                    <Checkbox onChange={this.agreement}>
                                        我已阅读并同意<a href="">《喝好茶用户协议》</a>
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                    <Button type="primary" htmlType="submit" disabled={!this.state.checked}>
                                        立即入驻
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                        <TabPane tab={title[3]} key="4">
                            <div style={{ marginTop: "20px" }}>
                                <span style={{ fontSize: "20px" }}>如有任何疑问，敬请联系8080888</span>
                                <div>
                                    <a target="_blank" href="http://sighttp.qq.com/authd?IDKEY=2e3c9b96a5a75cdbe6d12d0f22c1ee922970329a9cae1ac1"><img border="0" src="http://wpa.qq.com/imgd?IDKEY=2e3c9b96a5a75cdbe6d12d0f22c1ee922970329a9cae1ac1&pic=51" alt="点击这里给我发消息" title="点击这里给我发消息" /></a>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}