import React, { Component } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, PageHeader, Form, Input, Select, Upload, Modal, message, InputNumber } from 'antd';
import { GetOrgSelect } from '../staff/orgRoleSelect';
import { addImg } from '../../../../api/ipfs';
import sessionUtils from '../../../../utils/sessionUtils';
import { reqProduceAdd, reqProduceName, reqProducUpdate } from '../../../../api';
import TeaType from '../../../../components/teaType';
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
export default class EditProduce extends Component {
    state = {
        imgFileList: [],
        img: []
    }
    form = React.createRef();
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
    handleChange = ({ fileList }) => this.setState({ imgFileList: fileList });
    onRemove = (file) => {
        this.setState(state => {
            const index = state.imgFileList.indexOf(file);
            const newFileList = state.imgFileList.slice();
            newFileList.splice(index, 1);
            const i = state.img.indexOf(file.hash);
            const img = state.img.slice();
            img.splice(i, 1);
            return {
                imgFileList: newFileList,
                img
            };
        });
    }
    beforeUpload = file => {
        let reader = new FileReader();
        reader.readAsArrayBuffer(file)
        reader.onloadend = async (e) => {
            // 上传数据到IPFS
            let hash = await addImg(reader);
            const imgFileList = this.state.imgFileList
            imgFileList[imgFileList.length - 1].hash = hash
            this.setState(state => ({
                img: [...state.img, hash],
                imgFileList
            }));
        }
        this.setState(state => ({
            imgFileList: [...state.imgFileList, file]
        }));
        return false;
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
        const { produce, type, editType } = state
        const { img } = this.state
        const org = sessionUtils.get('org')
        values.img = img
        if (editType !== 'sys') {
            values.org = org.id ? org.id : ''
        } else {
            values.org = values.org ? values.org : ''
        }
        if (type === 'add') {
            const res = await reqProduceAdd(values)
            if (res.data.data) {
                message.success("新增成功")
                this.props.history.goBack()
            }
        } else {
            values.id = produce.id
            const res = await reqProducUpdate(values)
            if (res.data.data) {
                message.success("编辑成功")
                this.props.history.goBack()
            }
        }
    }
    componentDidMount() {
        const { state } = this.props.location
        const imgFileList = this.getFile(state.produce.img)
        this.setState({ imgFileList, img: state.produce.img ? state.produce.img : [] })
    }
    getFile = (img) => {
        let file = []
        if (Array.isArray(img)) {
            img.forEach((item, index) => {
                let f = {
                    name: item,
                    status: 'done',
                    hash: item,
                    url: global.ipfs.uri + item,
                    uid: index
                }
                file.push(f)
            });
        } else {
            if (img) {
                let f = {
                    name: img,
                    status: 'done',
                    hash: img,
                    url: global.ipfs.uri + img,
                    uid: 0
                }
                file.push(f)
            }
        }
        return file
    }
    render() {
        const { imgFileList } = this.state;
        const { state } = this.props.location
        if (!state) {
            this.props.history.goBack()
        }
        const { produce, type, editType } = state
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const validfunc = async (rule, value) => {
            const org = this.form.current.getFieldValue("org")
            if (org && type === 'add') {
                if (value) {
                    const res = await reqProduceName(value, org)
                    if (res.data.data === '') {

                    } else {
                        throw new Error(res.data.data);
                    }
                } else {
                    throw new Error('产品名是必须的!');
                }
            }

        }
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    onBack={() => this.props.history.goBack()}
                    title={type === 'add' ? "新增产品" : "编辑产品"}
                />

                <Form {...layout} ref={this.form} onFinish={this.onFinish} validateMessages={validateMessages}
                    initialValues={{
                        'name': produce.name,
                        "desc": produce.desc,
                        "typeId": produce.type_id,
                        "grade": produce.grade,
                        "specs": produce.specs,
                        "org": produce.org,
                        "price": produce.price,
                        "reserve": produce.reserve,
                        "eat": produce.eat,
                        "img": this.getFile(produce.img),
                        "state": produce.state,
                    }}>
                    <Form.Item name='name' label="产品名" validateTrigger="onBlur" rules={[{ validator: validfunc }]}>
                        <Input disabled={type === 'edit'} />
                    </Form.Item>
                    <Form.Item name='grade' label="等级" rules={[{ required: true }]}>
                        <Select
                            showSearch
                            placeholder="请选择等级"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {this.getOption('grade')}
                        </Select>
                    </Form.Item>
                    <Form.Item name='typeId' label="类型" rules={[{ required: true }]}>
                        <TeaType></TeaType>
                    </Form.Item>
                    {editType === 'sys' ? (
                        <div>
                            <Form.Item name='org' label="所属机构" rules={[{ required: true }]}>
                                <GetOrgSelect></GetOrgSelect>
                            </Form.Item>
                        </div>
                    ) : ("")}
                    <Form.Item name='specs' label="规格">
                        <Input />
                    </Form.Item>
                    <Form.Item name='price' label="价格">
                        <InputNumber
                            formatter={value => `￥${value}`}
                            parser={value => value.replace('￥', '')}
                        />
                    </Form.Item>
                    <Form.Item name='reserve' label="存量">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="img" label="图片" valuePropName="fileList"
                        getValueFromEvent={normFile} >
                        <Upload
                            onRemove={this.onRemove}
                            beforeUpload={this.beforeUpload}
                            listType="picture-card"
                            fileList={imgFileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                        >
                            {imgFileList.length >= 3 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item name='eat' label="食用方法">
                        <Input.TextArea autoSize />
                    </Form.Item>
                    <Form.Item name='desc' label="描述">
                        <Input.TextArea autoSize />
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
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
                            提交
                        </Button>
                        <Button htmlType="button" onClick={() => this.setState({ editVisible: false })}>
                            取消
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