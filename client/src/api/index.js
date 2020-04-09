import {ajax1,ajax2} from "./ajax";
import jsonp from 'jsonp'
import { message } from "antd";

/*包含应用中所以接口请求函数的模块 */


//登录
export const reqLogin = (name,password) => ajax2('/staff/login',{name,password},'GET')

//json的接口请求请求函数
export const reqWeather = (city) => {
    return new Promise((resolve,reject)=>{
        const url = 'http://api.map.baidu.com/telematics/v3/weather?location='+city+'&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
        jsonp(url,{},(err,data)=>{
            
            if(!err&&data.status==="success"){
                const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            }else{
                message.error('获取天气信息失败')
            }
        })
    })
    
}
//reqWeather('beijing')

//获取书籍类型的信息
export const reqBookTypeAll = () => ajax2('/bookType/all',{},'GET')

//获取书籍信息
export const reqBooks = (page,rows,sidx,sord,cond) => ajax2('/book',{page,rows,sidx,sord,cond},'GET')

//获取电子书籍信息
export const reqEBooks = (page,rows,sidx,sord,cond) => ajax2('/ebook',{page,rows,sidx,sord,cond},'GET')

//根据类别id获取类别信息
export const reqTypeName = (typeId) => ajax2('/bookType/typeName',{typeId},'GET')

//文件上传 图片
export const reqImageUpload = (formData) =>ajax2('/file',{formData},'POST')

//获取所有茶叶信息
export const reqTea = () =>ajax2('/tea/getAll',{},'GET')

//获取验证码
export const reqVerify = () =>ajax2('/verify/getVerify',{},'GET')

//验证验证码
export const reqCheckVerify = (verify) =>ajax2('/verify/checkVerify',{verify},'GET')

//获取字典对应值
export const reqDictionaryByCond = (typeCode,valueId) =>ajax2('/dictionary/getByCond',{typeCode,valueId},'GET')

//机构入住
export const reqOrgJoin = (org,staff) =>ajax2('/org/join',{org,staff},'POST')

