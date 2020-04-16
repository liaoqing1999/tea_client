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

//获取机构
export const reqOrg = (id) =>ajax2('/org/getOrg',{id},'GET')

//更新用户
export const reqUpdateStaff = (staff) =>ajax2('/staff/update',staff,'POST')

//角色分页
export const reqRolePage = (page,rows) =>ajax2('/role/getPage',{page,rows},'GET')

//删除角色
export const reqDeleteRole = (id) =>ajax2('/role/delete',{id},'GET')

//增加角色
export const reqAddRole = (role) =>ajax2('/role/add',role,'POST')

//通过名字查询角色
export const reqFindRoleByName = (name) =>ajax2('/role/findByName',{name},'GET')

//通过id查询角色
export const reqFindRole = (id) =>ajax2('/role/find',{id},'GET')

//更新角色
export const reqUpdateRole = (role) =>ajax2('/role/update',role,'POST')

