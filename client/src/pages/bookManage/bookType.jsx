import React,{ Component } from "react";
import { reqBookTypeAll, reqBooks, reqEBooks } from "../../api";
import {Button, Tree,Modal, Input,Tabs,} from 'antd';
import { StickyContainer, Sticky } from 'react-sticky';
import './bookType.less'
import MyTable from "../../utils/myTable"
import { AccountBookTwoTone, FolderTwoTone,BookTwoTone,DownOutlined,} from '@ant-design/icons';
import Test from "./tableTest";
import { Book } from "./book";

const { Search } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;
const datas = []
const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar {...props} className="site-custom-tab-bar" style={{ ...style }} />
    )}
  </Sticky>
);
export default class BookType extends Component{
    state = {
        treeData: [],        //树数据
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        dataList:[],
        filters:[],
        selectedKeys:'',
      
    }
    onExpand = expandedKeys => {
      this.setState({
        expandedKeys,
        autoExpandParent: false,
      });
    };
    //树收索事件
    onChange = e => {
      const { value } = e.target;
      const expandedKeys =datas.map(item => {
          if (item.title.indexOf(value) > -1) {
            return item.pid;
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      let s =[]
      if(value ===''){
      }else{
        s= expandedKeys
      }
      this.setState({
        expandedKeys:s,
        searchValue: value,
        autoExpandParent: true,
      });
    };
    //获取某节点的孩子节点
    getChiled = (data,id) => {
        const c = []; 
        data.forEach(item =>{
            let children = [];
            if(item.pid===id){
                children = this.getChiled(data,item.id)
                if(children.length===0){
                    c.push({key:item.id,title:item.name})
                }else{
                    c.push({key:item.id,title:item.name,children:children})
                }
                
            }
        })
        return c;
    }
    //将类型数据转换成树数据
    generateData = (data) => {
      const dataList = []
      
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { id,name,pid } = node;
            let children = [];
            datas.push({title:name,key:id,pid:pid})
            if(pid ==='0'){
                children = this.getChiled(data,id)
                dataList.push({ key:id, title: name ,children :children});
            }
        }
    this.setState({treeData:dataList})
    };

    //树点击事件
    onSelect = (selectedKeys, e) =>{
      if(selectedKeys[0]&&selectedKeys[0]!==this.state.selectedKeys){
        const ids = []
        if(e.node.children){
          e.node.children.forEach(item =>{
            ids.push(item.key)
          })
        }
        ids.push(selectedKeys[0])
        
        var filters={
          groupOp:"AND",
              rules:[
                 {field:"typeId",op:"in",data:ids} 
              ]
        }
        setTimeout(() =>{
          this.setState({filters:filters,selectedKeys:selectedKeys})
        },0)
       
      }else{
       
        setTimeout(() =>{
          this.setState({filters:[],selectedKeys:""})
        },0)
      }
     
    }
    
    //循环返回树形语句
    loop = data =>{
      const { searchValue} = this.state;
        return data.map(item=>{
          const index = item.title.indexOf(searchValue);
          const beforeStr = item.title.substr(0, index);
          const afterStr = item.title.substr(index + searchValue.length);
          const title =
            index > -1 ? (
              <span>
                {beforeStr}
                <span className="site-tree-search-value">{searchValue}</span>
                {afterStr}
              </span>
            ) : (
              <span>{item.title}</span>
            );
            if(item.children){
              return { title, key: item.key, children: this.loop(item.children),icon:<FolderTwoTone /> };
            }else{
              return {
                title,
                key: item.key,
                icon:<BookTwoTone />
              };
            }  
        })
    }
    //获取 类型数据
    getBookTypes =async () =>{
        const bookTypes = await reqBookTypeAll()  
        if(bookTypes){
            this.generateData(bookTypes.data)
        }
       
    }
  //书籍表
  getBookDates = async (page,rows,sidx,sord,cond) =>{
    const datas = await reqBooks(page,rows,sidx,sord,cond)
    return datas;
  }
  //电子书籍表
  getEBookDates = async (page,rows,sidx,sord,cond) =>{
    const datas = await reqEBooks(page,rows,sidx,sord,cond)
    return datas;
  }

  //书籍增加
  bookAdd = () =>{
    confirm({
      title: '增加书籍',
      content: (
        <div><Book treeData ={this.state.treeData}></Book></div>
      ),
      okText: '确定',
      okType: 'primary',
     
      cancelText: '取消',
      onOk() {
        this.props.delete(this.state.selectedRowKeys)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  //书籍修改

  //书籍删除

  //书籍查看

  //render前事件
    componentDidMount(){
        this.getBookTypes()
        //this.getBooks(this.state.pageNum,this.state.pageSize)
    }
 
    render(){
       
        const columns = [
          {
            title: 'id',
            fixed: 'left',
            width: 80,
            dataIndex: 'id',
            key: 'id',
          
          },
          {
            title: '书名',
            dataIndex: 'bookName',
            fixed: 'left',
            key: 'bookName',
            width: 100,
            render: text => <a>{text}</a>,
           
          },
          {
            title: '描述',
            dataIndex: 'des',
            key: 'des',
           
          },
          {
            title: '作者',
            dataIndex: 'writer',
            key: 'writer',
            width: 80,
            
          },
          {
            title: '出版社',
            dataIndex: 'printer',
            key: 'printer',
            width: 80,
            
          },
          
          {
            title: '存放地点',
            dataIndex: 'place',
            width: 80,
            key: 'place',
           
          },
          {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: 80,
           
          },
          {
            title: '馆藏量',
            dataIndex: 'store',
            key: 'store',
            width: 80,
           
          },
          
        ];
        const columns1 =[
          {
            title: 'id',
            fixed: 'left',
            width: 80,
            dataIndex: 'id',
            key: 'id',
          
          },
          {
            title: '书名',
            dataIndex: 'ebookName',
            fixed: 'left',
            key: 'ebookName',
            width: 100,
            render: text => <a>{text}</a>,
          },
          {
            title: '描述',
            dataIndex: 'des',
            key: 'des',

            render: text => <div dangerouslySetInnerHTML={{__html:text}}></div>,
          },
          {
            title: '作者',
            dataIndex: 'writer',
            key: 'writer',
            width: 80,
          },
          {
            title: '热度',
            dataIndex: 'hot',
            key: 'hot',
            width: 80,
          },
        ]
        return (
            <div className="bookType"> 
            <div className="bookType-typeTree"> 
                {
            this.state.treeData.length ? (
              <div>
                <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
                <Tree
                showIcon
                switcherIcon={<DownOutlined />}
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onSelect = {this.onSelect}
                treeData={this.loop(this.state.treeData)}
                > 
                </Tree>
              </div>
            ) : (
                'loading tree'
            )
            }
          </div>
          <div className="bookType-bookTable">
          <StickyContainer>
            <Tabs defaultActiveKey="1" renderTabBar={renderTabBar} >
              <TabPane tab={<span><BookTwoTone />实体书</span>} key="1" style={{ height: "80%" }}>
                <MyTable add={this.bookAdd} view={this.bookView} delete={this.bookDelete} edit={this.bookEdit} 
                filters={this.state.filters} columns={columns} getDates ={this.getBookDates}></MyTable>
              </TabPane>
              <TabPane  tab={<span><AccountBookTwoTone />电子书</span>} key="2">
                <MyTable add={this.ebookAdd} view={this.ebookView} delete={this.ebookDelete} edit={this.ebookEdit} 
                filters={this.state.filters} columns={columns1} getDates ={this.getEBookDates}></MyTable>
              </TabPane>
              <TabPane  tab={<span><AccountBookTwoTone />测试</span>} key="3">
                <Test></Test>
              </TabPane>
            </Tabs>
          </StickyContainer>
         
        </div>
        </div>
        )
    }
}