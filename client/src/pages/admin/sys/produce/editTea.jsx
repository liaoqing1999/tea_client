import React, { Component } from "react";
import { Select, Form, Button, Input, Upload ,Modal, message} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { reqStaffName, reqAddTea, reqUpdateTea } from "../../../../api";
import TeaType from "../../../../components/teaType";
import { addImg } from "../../../../api/ipfs";
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
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
const { Option } = Select;
export default class EditTea extends Component {
    state = {
        tea: {},
        imgFileList: [],
        img: [],
        qr: "",
        qrFileList: [],
    }
    form = React.createRef();
    componentDidMount() {
        const { tea } = this.props
        const imgFileList = this.getFile(tea.img)
        const qrFileList = this.getFile(tea.qr)
        this.setState({ imgFileList, qrFileList, qr: tea.qr ? tea.qr : "", img: tea.img ? tea.img : [] })
    }
    //接收父组件属性前
    componentWillReceiveProps(nextProps) {
        const { tea } = nextProps
        const imgFileList = this.getFile(tea.img)
        const qrFileList = this.getFile(tea.qr)
        this.setState({ imgFileList, qrFileList, qr: tea.qr ? tea.qr : "", img: tea.img ? tea.img : [] })
        this.form.current.setFieldsValue({
            'name': tea.name,
            "typeId": tea.typeId,
            "batch": tea.batch,
            "grade": tea.grade,
            "period": tea.period,
            "store": tea.store,
            "img": this.getFile(tea.img),
            "qr": this.getFile(tea.qr)
        });
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

    handleChangeQR = ({ fileList }) => this.setState({ qrFileList: fileList });
    onRemoveQR = (file) => {
        this.setState(state => {
            const index = state.qrFileList.indexOf(file);
            const newFileList = state.qrFileList.slice();
            newFileList.splice(index, 1);
            return {
                qrFileList: newFileList,
                qr:""
            };
        });
    }
    beforeUploadQR = file => {
        let reader = new FileReader();
        reader.readAsArrayBuffer(file)
        reader.onloadend = async (e) => {
            // 上传数据到IPFS
            let hash = await addImg(reader);
            const qrFileList = this.state.qrFileList
            qrFileList[qrFileList.length - 1].hash = hash
            this.setState(state => ({
                qr: hash,
                qrFileList
            }));
        }
        this.setState(state => ({
            qrFileList: [...state.qrFileList, file]
        }));
        return false;
    }
    onFinish = async (values) => {
        const { tea,produce,type } = this.props
        const { img,qr} = this.state
        tea.img = img
        tea.qr = qr 
        tea.name = values.name
        tea.typeId = values.typeId 
        tea.batch = values.batch
        tea.grade = values.grade 
        tea.period = values.period
        tea.store = values.store 
        if (type === 'add') {
            tea.produce = produce.id
            const res = await reqAddTea(tea)
            if (res.data.data) {
                message.success("新增成功")
                this.props.hideModal()
            }
        } else {
            const res = await reqUpdateTea(tea)
            if (res.data.data) {
                message.success("编辑成功")
                this.props.hideModal()
            }
        }
    }
    getOption = (name) => {
        const dict = this.props.dict
        if (dict[name] && Array.isArray(dict[name])) {
            return dict[name].reduce((pre, item) => {
                pre.push((
                    <Option key={item.id} value={item.valueId}>{item.valueName}</Option>
                ))
                return pre
            }, [])
        }

    }
    render() {
        const { tea } = this.props
        const { imgFileList,qrFileList } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const validfunc = async (rule, value) => {
            if (!tea.name) {
                if (value) {
                    const res = await reqStaffName(value)
                    if (res.data.data === '') {

                    } else {
                        throw new Error('用户名已存在!');
                    }
                } else {
                    throw new Error('用户名是必须的!');
                }
            }

        }
        return (<div>
            <Form {...layout} ref={this.form} onFinish={this.onFinish} validateMessages={validateMessages}
                initialValues={{
                    'name': tea.name,
                    "typeId": tea.typeId,
                    "batch": tea.batch,
                    "grade": tea.grade,
                    "period": tea.period,
                    "store": tea.store,
                    "img": this.getFile(tea.img),
                    "qr": this.getFile(tea.qr)
                }}>
                <Form.Item name='name' label="茶叶名" >
                    <Input/>
                </Form.Item>
                <Form.Item name='typeId' label="类型" rules={[{ required: true }]}>
                    <TeaType></TeaType>
                </Form.Item>
                <Form.Item name='batch' label="批次">
                    <Input />
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
                <Form.Item name='period' label="保质期">
                    <Input />
                </Form.Item>
                <Form.Item name='store' label="存储条件">
                    <Input />
                </Form.Item>
                <Form.Item name="img" label="茶叶图片" valuePropName="fileList"
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
                <Form.Item name="qr" label="二维码" valuePropName="fileList"
                    getValueFromEvent={normFile} >
                    <Upload
                        onRemove={this.onRemoveQR}
                        beforeUpload={this.beforeUploadQR}
                        listType="picture-card"
                        fileList={qrFileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChangeQR}
                    >
                        {qrFileList.length >= 1 ? null : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4}}>
                    <Button type="primary" htmlType="submit">提交 </Button>
                    <Button type="link" onClick={this.props.hideModal}>取消</Button>
                </Form.Item>
            </Form>

            <Modal bodyStyle={{ backgroundColor: "white" }} visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
                <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
            </Modal>
        </div>)
    }
}