import React,{ Component } from "react";
import {
    Form,
    Input,  
    Upload,
    InputNumber,
    TreeSelect,  
    Button,
  } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
export class Book extends  Component{
    render(){
        let treeData = JSON.parse(JSON.stringify(this.props.treeData).replace(/key/g,"value"));
     
        return(
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                initialValues= "small"
                size="small"
            >
                <Form.Item label="书名" name="bookName" 
                rules={[{ required: true, message: '请输入书名!' }]}>
                <Input />
                </Form.Item>
                <Form.Item label="作者" name="writer" 
                rules={[{ required: true, message: '请输入作者名!' }]}>
                <Input />
                </Form.Item>
                <Form.Item label="出版社" name="printer" 
                rules={[{ required: true, message: '请输入出版社名!' }]}>
                <Input />
                </Form.Item>
                <Form.Item label="类型" name="typeId" 
                rules={[{ required: true, message: '请选择书籍类型!' }]}>
                <TreeSelect
                    treeData={treeData}
                />
                </Form.Item>
                <Form.Item label="书籍图片" name="image">
                <Upload action= 'https://www.mocky.io/v2/5cc8019d300000980a055e76' listType= 'picture'>
                    <Button>
                    <UploadOutlined /> Upload
                    </Button>
                </Upload>
                </Form.Item>
           
                <Form.Item label="价格" name="price">
                <InputNumber min={0} defaultValue={1000}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}/>
                </Form.Item>
                <Form.Item label="书籍存量" name="store">
                <InputNumber min={0} defaultValue={0}/>
                </Form.Item>
                <Form.Item label="存放地点" name="place">
                <Input />
                </Form.Item>
            </Form>
        )
    }
}