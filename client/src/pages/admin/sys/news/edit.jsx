import React, { Component } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, PageHeader, Form, Input, Select, Upload, Modal, message } from 'antd';
import { GetOrgSelect } from '../staff/orgRoleSelect';
import { addImg } from '../../../../api/ipfs';
import RichEditor from '../../../../components/richEditor';
import sessionUtils from '../../../../utils/sessionUtils';
import memoryUtils from '../../../../utils/memoryUtils';
import { reqOrg, reqAddNews, reqUpdateNews } from '../../../../api';
const { Option } = Select
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
  labelCol: { span: 2 },
  wrapperCol: { span: 10 },
};
const normFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default class EditNews extends Component {
  state = {
    coverFileList: [],
    cover: "",
    contentFileList: [],
    hash: []
  }

  ipfsUpload = async (fileList) => {
    let hash = []
    if (Array.isArray(fileList)) {
      for (let i = 0; i < fileList.length; i++) {
        let reader = new FileReader()
        reader.readAsArrayBuffer(fileList[i])
        let promise = new Promise(resolve => {
          reader.onloadend = (e) => {
            // 上传数据到IPFS
            addImg(reader).then((h) => {
              resolve(h)
            });
          }
        })
        hash[i] = await promise;
      }
      return hash
    } else {
      let reader = new FileReader();
      reader.readAsArrayBuffer(fileList)
      let promise = new Promise(resolve => {
        reader.onloadend = (e) => {
          // 上传数据到IPFS
          addImg(reader).then((h) => {
            resolve(h)
          });
        }
      })
      return await promise
    }
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  handleChange = ({ fileList }) => this.setState({ coverFileList: fileList });
  onRemove = (file) => {
    this.setState(state => {
      const index = state.coverFileList.indexOf(file);
      const newFileList = state.coverFileList.slice();
      newFileList.splice(index, 1);
      return {
        coverFileList: newFileList,
      };
    });
  }
  beforeUpload = file => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file)
    reader.onloadend = async (e) => {
      // 上传数据到IPFS
      let hash = await addImg(reader);
      this.setState({ cover: hash })
    }
    this.setState(state => ({
      coverFileList: [...state.coverFileList, file]
    }));
    return false;
  }

  beforeUploadContent = file => {
    this.setState(state => ({
      contentFileList: [...state.contentFileList, file],
    }));
    this.getContentImgHash(file)
    return false;
  }
  handleChangeContent = ({ fileList }) => this.setState({ contentFileList: fileList });
  onRemoveContent = (file) => {
    this.setState(state => {
      const index = state.contentFileList.indexOf(file);
      const newFileList = state.contentFileList.slice();
      const hash = state.hash.slice();
      hash.splice(index, 1);
      newFileList.splice(index, 1);
      return {
        contentFileList: newFileList,
        hash
      };
    });
  }
  getContentImgHash = async (file) => {
    let hash = await this.ipfsUpload(file)
    hash = global.ipfs.uri + hash + '\n'
    this.setState(state => ({
      hash: [...state.hash, hash],
    }));
  }
  getOption = (name) => {
    const { state } = this.props.location
    const { dict } = state
    if (Array.isArray(dict[name])) {
      return dict[name].reduce((pre, item) => {
        pre.push((
          <Option key={item.id} value={item.valueId}>{item.valueName}</Option>
        ))
        return pre
      }, [])
    }
  }
  getDictValue = (id) => {
    const { state } = this.state
    if (Array.isArray(state)) {
      const result = state.find(item => item.valueId === id)
      if (result) {
        return result.valueName
      } else {
        return id
      }
    }
  }
  onFinish = async (values) => {
    const { state } = this.props.location
    const { cover } = this.state
    const { news, type, editType } = state
    const org = sessionUtils.get('org')
    const user = memoryUtils.user
    values.cover = cover
    if (editType !== 'sys') {
      values.org = org.id ? org.id : ''
      values.orgName = org.name ? org.name : ''
    } else {
      values.org = values.org ? values.org : ''
      if (values.org) {
        const res = await reqOrg(values.org)
        values.orgName = res.data.data ? res.data.data.name : ''
      }

    }
    if (type === 'add') {
      values.date = new Date()
      values.publisher = user.name
      values.read = 0
      values.up = 0
      values.down = 0
      values.rate = 0.0
      values.rateNum = 0
      values.avatar = user.img
      const res = await reqAddNews(values)
      if (res.data.data) {
        message.success("新增成功")
        this.props.history.goBack()
      }
    } else {
      values.id = news.id
      values.avatar = news.avatar
      values.publisher = news.publisher
      values.date = news.date
      values.read = news.read
      values.up = news.up
      values.down = news.down
      values.rate = news.rate
      values.rateNum = news.rate_num
      const res = await reqUpdateNews(values)
      if (res.data.data) {
        message.success("编辑成功")
        this.props.history.goBack()
      }
    }
  }
  componentDidMount() {
    const { state } = this.props.location
    const coverFileList = this.getCover(state.news.cover)
    this.setState({ coverFileList, cover: state.news.cover })
  }
  getCover = (cover) => {
    if (cover) {
      let file = {}
      file.uid = 0
      file.name = '封面'
      file.status = 'done'
      file.url = global.ipfs.uri + cover
      return [file]
    } else {
      return []
    }
  }
  render() {
    const { coverFileList, contentFileList, hash } = this.state;
    const { state } = this.props.location
    if (!state) {
      this.props.history.goBack()
    }
    const { news, type, dict, editType } = state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div>
        <PageHeader
          className="site-page-header"
          onBack={() => this.props.history.goBack()}
          title={type === 'add' ? "新增资讯" : "编辑资讯"}
        />

        <Form {...layout} ref={this.form} onFinish={this.onFinish} validateMessages={validateMessages}
          initialValues={{
            'title': news.title,
            "desc": news.desc,
            "type": news.type,
            "writer": news.writer,
            "content": news.content,
            "avatar": news.avatar,
            "org": news.org,
            "href":news.href,
            "cover": this.getCover(news.cover),
            "state": news.state,
          }}>
          <Form.Item name='title' label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='writer' label="作者" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {editType === 'sys' ? (
            <div>
              <Form.Item name='type' label="类型" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="请选择类型"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.getOption('news_type')}
                </Select>
              </Form.Item>
              <Form.Item name='org' label="所属机构">
                <GetOrgSelect></GetOrgSelect>
              </Form.Item>
            </div>
          ) : ("")}
          <Form.Item name="cover" label="封面" valuePropName="fileList"
            getValueFromEvent={normFile} rules={[{ required: true }]}>
            <Upload
              onRemove={this.onRemove}
              beforeUpload={this.beforeUpload}
              listType="picture-card"
              fileList={coverFileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {coverFileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item name='desc' label="描述">
            <Input.TextArea autoSize />
          </Form.Item>
          <Form.Item name='href' label="跳转链接">
            <Input />
          </Form.Item>
          <Form.Item name='state' label="状态" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="请选择状态"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.getOption('state')}
            </Select>
          </Form.Item>
          <Form.Item label="内容图片转换" wrapperCol={16} valuePropName="fileList"
            getValueFromEvent={normFile}>
            <Upload
              beforeUpload={this.beforeUploadContent}
              onRemove={this.onRemoveContent}
              listType="picture-card"
              fileList={contentFileList}
              onPreview={this.handlePreview}
              onChange={this.handleChangeContent}
            >
              {uploadButton}
            </Upload>
            <Input.TextArea value={hash.join(" ")} disabled autoSize></Input.TextArea>
          </Form.Item>
          <Form.Item name='content' label="内容" wrapperCol={16}  >
            <RichEditor></RichEditor>
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
              提交
            </Button>
          </Form.Item>
        </Form>
        <Modal bodyStyle={{ backgroundColor: "white" }} visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    );
  }
}