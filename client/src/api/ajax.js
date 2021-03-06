import Axios from "axios";
import { message } from "antd";

/*能发送异步ajax请求的函数模块 
封装axios库
函数的返回值是promise对象
*/
export  function ajax1(url,data={},type='GET'){   
        if(type==='GET'){
           return  Axios.get(url,{
                params:data
            });
        }else{
           return  Axios.post(url,data);
        }
    
}
export  function ajax2(url,data={},type='GET'){ 
    url='/api'+url
    return new Promise((resolve,reject) =>{
        const qs = require('qs')
        let promise
        //1.执行异步ajax请求
        if(type==='GET'){
            promise =  Axios.get(url,{
                 params:data,
                 paramsSerializer: function (params) {
                    return qs.stringify(params, {arrayFormat: 'repeat'})
                },
             });
         }else if(type==='DELETE'){
            promise =  Axios.delete(url,{
                params:data,
                paramsSerializer: function (params) {
                   return qs.stringify(params, {arrayFormat: 'repeat'})
               },
            });
         }else{
            promise =  Axios.post(url,data);
         }

         //2.如果成功了，调用resolve（value）
         promise.then(response =>{
             resolve(response)
         }).catch(error =>{
             if(window.location.href.indexOf('admin')!==-1){
                window.location.href='/admin/500'
             }else{
               window.location.href='/500'
             }
             message.error('请求出错了:'+error.message)
         })
    })  
}
