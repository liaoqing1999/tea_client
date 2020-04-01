import React,{Component} from 'react'
import SearchTea from '../searchtea';
import { Tabs} from 'antd';
import {Typography,Steps,Form, Input,Tooltip, Upload, Button} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;
const title = ["入住条件","入住流程","快速入住","客服咨询"];

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
 

export default class Join extends Component{
    
    onFinish = values => {
        console.log(values);
      };
    state = {
        text:title[0],
        current: 0,
        verify :""
    }
    onChange = (activeKey) => {
        this.setState({
            text:title[activeKey-1]
        })
    }
    getVerify =async () => {
        
       this.setState({verify:Math.random()})
    }
    onStepChange = current => {
        this.setState({ current });
    };
    render(){
        const { current } = this.state;
        return(
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
            <div className="about-center">
              <Tabs defaultActiveKey="1" tabPosition="left" onChange={this.onChange}>
              <TabPane tab={title[0]} key="1">
              <Typography style={{textIndent:"2em",marginTop:"10px"}}>
                    <Title>入住条件</Title>
                    <Paragraph>
                    <Text strong style={{fontSize:"15px"}}>
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
                    <Steps current={current} onChange={this.onStepChange} style={{marginTop:"10px",marginBottom:"20px"}}>
                        <Step title="入住申请" description="填写入住申请的相关信息">
                            </Step>
                        <Step title="管理员审核" description="我们的管理员会对您的申请进行审核" />
                        <Step title="成为会员" description="恭喜您，成为了我们的会员" />
                    </Steps>
                    <div  style={{height:"250px"}}>{content[current]}</div>
                </TabPane>
                <TabPane tab={title[2]} key="3">
                <Form style={{marginTop:"10px",marginBottom:"20px"}} {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
                    <span style={{lineHeight:"30px",textIndent:"1.5em",fontSize:"15px",display:"block",width:"100%",backgroundColor:'#efefef',margin:"10px 0px"}}>机构管理员信息</span>
                    <Form.Item name={['org','admin', 'name']} label="管理员账号" rules={[{ required: true }]} hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['org','admin', 'password']} label="管理员密码" rules={[{required: true}]} hasFeedback>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="confirm" label="确认密码" dependencies={['org','admin', 'password']} hasFeedback
                        rules={[{required: true},
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                            if (!value || getFieldValue(['org','admin', 'password']) === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('两次输入密码不一致!');
                            },
                        }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <span style={{lineHeight:"30px",textIndent:"1.5em",fontSize:"15px",display:"block",width:"100%",backgroundColor:'#efefef',margin:"10px 0px"}}>企业信息</span>
                    <Form.Item name={['org', 'name']} label="企业名称" rules={[{ required: true }]} hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['org', 'corporation']} label="法人" rules={[{ required: true }]} hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['org', 'phone']} label="联系电话" rules={[{ required: true },{pattern:new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"), message: '请输入正确的手机号' }]} hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['org', 'description']} label="企业介绍" rules={[{ required: true }]} hasFeedback>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name={['org', 'license']} label="生产许可证编号" rules={[{ required: true }]} hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['org', 'permit']} label="营业执照"  valuePropName="fileList"
                        getValueFromEvent={normFile} rules={[{ required: true }]} hasFeedback>
                        <Upload name="permit" action="/upload.do" listType="picture">
                        <Button>
                            <UploadOutlined /> 上传营业执照
                        </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name={['org', 'codePermit']} label="组织机构代码证" valuePropName="fileList"
                        getValueFromEvent={normFile} rules={[{ required: true }]} hasFeedback>
                        <Upload name="permit" action="/upload.do" listType="picture">
                            <Button>
                                <UploadOutlined /> 组织机构代码证
                            </Button>
                            </Upload>
                    </Form.Item>
                    <Form.Item name={['org', 'email']} label="邮箱" rules={[{ type: 'email' }]} hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['org', 'place']} label="地区" rules={[{ required: true }]} hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['org', 'remark']} label="备注" rules={[{ required: true }]} hasFeedback>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item  label="验证码"   rules={[{ required: true }]} hasFeedback>
                        <Form.Item name={['verify']}  rules={[{ required: true ,message: '验证码不能为空' }]} style={{ display: 'inline-block', width: 'calc(50% - 5px)' }}>
                            <Input />
                        </Form.Item>
                        <div onClick={this.getVerify}  style={{ display: 'inline-block', width: 'calc(50% - 5px)' }}>
                        <Tooltip placement="topLeft" title="看不清？点击更换">
                        <img alt="验证码"  style={{marginLeft:"15px",width:"100px",height:"30px"}} src={"http://127.0.0.1:8090/tea/test?p="+this.state.verify}></img>
                        </Tooltip>  
                        </div>
                    </Form.Item> 
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                        立即入驻
                        </Button>
                    </Form.Item>
                </Form>
                </TabPane>
                <TabPane tab={title[3]} key="4">
                    <div style={{marginTop:"20px"}}>
                    <span style={{fontSize:"20px"}}>如有任何疑问，敬请联系8080888</span>
                    <div>
                    <a target="_blank" href="http://sighttp.qq.com/authd?IDKEY=2e3c9b96a5a75cdbe6d12d0f22c1ee922970329a9cae1ac1"><img border="0"  src="http://wpa.qq.com/imgd?IDKEY=2e3c9b96a5a75cdbe6d12d0f22c1ee922970329a9cae1ac1&pic=51" alt="点击这里给我发消息" title="点击这里给我发消息"/></a>
                    </div>
                    </div>
                </TabPane>
              </Tabs>       
            </div>
          </div>
        )
    }
}