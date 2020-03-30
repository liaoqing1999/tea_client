import React,{ Component } from "react";
import {Table, Button,Input,Switch,Popover,Tooltip, message,Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import { WarningOutlined, PlusCircleTwoTone,EditTwoTone,ProfileTwoTone,DeleteTwoTone } from '@ant-design/icons';
const { confirm } = Modal;

export default class MyTable extends Component{
   
     state = {
        selectedRowKeys: [], // 已选列
        loading: false,      //是否加载
        pageSize:10,         //表页大小
        totals:0,            //表数据总量
        pageNum:1,           //第几页
        tableData : [],      //表数据
        filters:this.props.filters,          //条件
        search:true,
    }
    paginationProps = {
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: () => `共${this.state.totals}条`,
        total: this.state.totals,
        onShowSizeChange: (current,pageSize) => this.changePageSize(pageSize,current),
        onChange: (current) => this.changePage(current),
        };
    //页面改变函数
    changePage = (current) =>{
        this.getDatas(current,this.state.pageSize,'','',JSON.stringify({filters:this.state.filters}))
        this.setState({
        pageNum: current,
        });
    }
    // 回调函数,每页显示多少条
    changePageSize = (pageSize,current) =>{
        // 将当前改变的每页条数存到state中
        this.getDatas(this.state.pageNum,pageSize,'','',JSON.stringify({filters:this.state.filters}))
        this.setState({
          pageSize: pageSize,
        });
        
      }
    //获取表中书籍数据
    getDatas =async (page,rows,sidx,sord,cond) =>{
      
        const datas = await this.props.getDates(page,rows,sidx,sord,cond)
        const data = [];
        if(datas){
            datas.data.contents.forEach( item =>  {
                // const typeName = await reqTypeName(item.typeId)
                // if(typeName){
                // item.typeName = typeName.data
                data.push(item)
                // this.setState({ typeName: typeName.data });
                //}
            })
            this.paginationProps.total = datas.data.total
            this.setState({ tableData: data ,totals: datas.data.total});
        }
    }
    //取消选中
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }, 1000);
    };
      //表行选中触发事件
      onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      };
    //搜索事件
      getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              查找
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              取消
            </Button>
          </div>
        ),
        render: text =>this.state.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text.toString()}
            />
          ) : (
            text
          ),
        
      });
  //搜索处理事件
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    var filters={
      groupOp:"AND",
          rules:[
             {field:dataIndex,op:"cn",data:selectedKeys[0]} 
          ]
  }
  //$view.列表id.refresh({filters:filters}) 
    confirm();
    this.setState({
      filters:filters,
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  
    this.getDatas(this.state.pageNum,this.state.pageSize,'','',JSON.stringify({filters:filters}))
   
  };
  //取消事件
  handleReset = clearFilters => {
    
    clearFilters();
    this.setState({ searchText: '' , filters:[],});
    this.getDatas(this.state.pageNum,this.state.pageSize)
  };
  //render前事件
    componentDidMount(){
        this.getDatas(this.state.pageNum,this.state.pageSize)
    };
    //接收父组件属性前
    componentWillReceiveProps(nextProps){
      this.setState({filters:nextProps.filters})
      this.getDatas(this.state.pageNum,this.state.pageSize,'','',JSON.stringify({filters:nextProps.filters}))
    }
     //switch 改变事件
    switchChange = (checked,event) =>{
      this.setState({search:checked})
    }
    //edit
    edit = () =>{
      if(this.state.selectedRowKeys.length===0){
        message.error("未选中表格行")
      }else{
        const d =this.state.tableData.find((data) =>(data.id===this.state.selectedRowKeys[0]))
        this.props.edit(d)
      }
    }
    //view
    view = () =>{
      if(this.state.selectedRowKeys.length===0){
        message.error("未选中表格行")
      }else{
        const d =this.state.tableData.find((data) =>(data.id===this.state.selectedRowKeys[0]))
        this.props.view(d)
      }
    }
    //delete
    delete = () =>{
      if(this.state.selectedRowKeys.length===0){
        message.error("未选中表格行")
      }else{
        confirm({
          title: '确定要删除这些数据吗?',
          icon: <WarningOutlined />,
          content: '这会导致某些数据的丢失',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            this.props.delete(this.state.selectedRowKeys)
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }
    }
    render(){
    const c =[ ];
    this.props.columns.forEach(item=>{
      if(!this.state.search){
        c.push(item)
      }else{
        c.push({
          title: item.title,
          fixed: item.fixed,
          width: item.width,
          dataIndex:  item.dataIndex,
          key: item.key,
          render:item.render,
          ...this.getColumnSearchProps(item.key),
        })
      }
      
    })
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
        <div>
        <Table 
         scroll={{ x: 1100, y: 380 }} 
         pagination={this.paginationProps} 
         rowKey={record =>record.id} 
         rowSelection={rowSelection} 
         size="middle"
         columns={c} dataSource={this.state.tableData} 
         title={() =>
          <div>
            <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading} style={{marginRight:"10px"}}>
            清空
            </Button>
            <Tooltip placement="top" title={"新增"}>
              <Button size="large" type="link" shape="circle" onClick={this.props.add}><PlusCircleTwoTone /></Button>
            </Tooltip>
            <Tooltip placement="top" title={"修改"}>
              <Button size="large"  type="link" shape="circle" onClick={this.edit}> <EditTwoTone /></Button>
            </Tooltip>
            <Tooltip placement="top" title={"查看"}>
              <Button size="large" type="link" shape="circle" onClick={this.view}> <ProfileTwoTone /></Button>
            </Tooltip>
            <Tooltip placement="top" title={"删除"}>
              <Button  size="large" type="link" shape="circle" onClick={this.delete}><DeleteTwoTone /></Button>
            </Tooltip>
            <div style={{float:"right"}}>
            <Popover title="是否开启搜索功能" trigger="hover">
              <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={this.switchChange}/>
            </Popover>
            </div>
          </div>
            }
         />
        </div>
        )
    }
}