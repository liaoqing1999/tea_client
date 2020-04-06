import React, { Component } from 'react'
import { Button, Input, Upload, Modal } from 'antd'
import { addText, catText, addImg } from '../../../api/ipfs'
import { PlusOutlined } from '@ant-design/icons';
import Place from '../../../components/place';
const { Search } = Input;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        console.log(reader)
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export default class Brand extends Component {
    state = {
        fileList: []
    }
    onClick = async () => {
        const res = await addText("aaaaaaa")
        console.log(res)
    }
    onClick2 = (value, event) => {
        const res = catText(value)
        console.log(res)
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        console.log(this.state.fileList)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });
    onRemove = (file) => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      }
    beforeUpload= file => {
        this.setState({file:file})
        this.setState(state => ({
            fileList: [...state.fileList, file],
        }));
        return false;
      }
    handleUpload = () => {
        
        const { fileList } = this.state;
        console.log(fileList)
        let reader = new FileReader();
        let hash
        console.log(reader);
        //console.log(new File(fileList[0]))
        reader.readAsArrayBuffer(this.state.file)
        reader.onloadend = async (e) => {
            // 上传数据到IPFS
            console.log(reader);
            hash = await addImg(reader);
            console.log(hash)
        }
      };
    render() {
        const { previewVisible, previewImage, fileList } = this.state;

        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="top">
                <Place></Place>
                <Button onClick={this.onClick}>ipfs上传</Button>
                <Search onSearch={this.onClick2}></Search>
                <div>
                    <label id="file">Choose file to upload</label>
                    <input type="file" ref="file" id="file" name="file" multiple="multiple" />
                </div>
                <div>
                    <button onClick={() => {
                        var file = this.refs.file.files[0];
                        console.log(file)
                        var reader = new FileReader();
                        // reader.readAsDataURL(file);
                        console.log(reader);
                        reader.readAsArrayBuffer(file)
                        reader.onloadend =async (e) => {
                            console.log(reader);
                            const hash =await addImg(reader)
                            console.log(hash)
                        }
                    }}>Submit</button>
                </div>
                <Upload
                    onRemove={this.onRemove}
                    beforeUpload={this.beforeUpload}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Button onClick ={this.handleUpload }>点击上传</Button>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            </div >
        )
    }
}