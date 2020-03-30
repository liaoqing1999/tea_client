import React,{ Component } from "react";
import { Upload, Button, message } from 'antd';
import { PlusOutlined ,UploadOutlined ,LoadingOutlined, ForkOutlined} from '@ant-design/icons';
import { reqImageUpload } from "../../api";
import reqwest from 'reqwest';
export default class Test extends React.Component {
  state = {
    loading: false,
    fileList:[]
  };
  render() {
  const uploadButton = (
    <div>
      {this.state.loading ? <LoadingOutlined />: <PlusOutlined />}
      <div className="ant-upload-text">上传</div>
    </div>
  );
  const { imageUrl } = this.state;
  const props = {
    name: "image",
    showUploadList: false,//设置只上传一张图片，根据实际情况修改
    customRequest:async info => {//手动上传
      const { fileList } = this.state;
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('files[]', file);
      });
      const c =await reqImageUpload(formData)
      // const formData = new FormData();
      // formData.append('image', info.file);//名字和后端接口名字对应
      // console.log(formData)
      
      // reqwest({
      //   url: 'http://localhost:8080/user/uploadImage',//上传url
      //   method: 'post',
      //   processData: false,
      //   data: formData,
      //   success: (res) => {//上传成功回调
      //     if (res.code === '0') {
      //       this.setState({
      //         imageUrl: res.imageUrl
      //       });
      //       message.success('上传成功！');
      //     }
      //   },
      //   error: () => {//上传失败回调
      //     message.error('上传失败！');
      //   },
      // });
    },
    onRemove: file => {//删除图片调用
      this.setState(state => {
        const index = state.fileList.indexOf(file);
        const newFileList = state.fileList.slice();
        newFileList.splice(index, 1);
        return {
          fileList: newFileList,
        };
      });
    },
    listType: "picture",
    beforeUpload: file => {//控制上传图片格式
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      // this.setState({fileList:[]})
      this.setState({
        fileList: [file],
      });
      if (!isJpgOrPng) {
        message.error('您只能上传JPG/PNG 文件!');
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小必须小于2MB!');
        return;
      }
      return isJpgOrPng && isLt2M;
    },
  };


  return (
      <div>
      <Upload {...props}>
        <Button>
          <UploadOutlined /> Upload
        </Button>
      </Upload>
    </div>
  )
  }
}
