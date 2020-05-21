import { ajax1, ajax2 } from "./ajax";
import jsonp from 'jsonp'
import { message } from "antd";

/*包含应用中所有接口请求函数的模块 */
//登录
export const reqLogin = (name, password) => ajax2('/staff/login', { name, password }, 'GET')

//json的接口请求请求函数
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = 'http://api.map.baidu.com/telematics/v3/weather?location=' + city + '&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
        jsonp(url, {}, (err, data) => {

            if (!err && data.status === "success") {
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve({ dayPictureUrl, weather })
            } else {
                message.error('获取天气信息失败')
            }
        })
    })

}
//获取所有茶叶信息
export const reqTea = () => ajax2('/tea/getAll', {}, 'GET')

//获取茶叶分页
export const reqPageTea = (page, rows, cond) => {
    cond = JSON.stringify(cond)
    return ajax2('/tea/getPage', { page, rows, cond }, 'GET')
}

//获取茶叶
export const reqGetTea = (id) => ajax2('/tea/get', {id}, 'GET')

//添加茶叶
export const reqAddTea = (tea) => ajax2('/tea/add', tea, 'POST')

//更新茶叶
export const reqUpdateTea = (tea) => ajax2('/tea/update', tea, 'POST')

//删除茶叶
export const reqDeleteTea = (id) => ajax2('/tea/delete', {id}, 'GET')

//获取茶叶种植阶段信息
export const reqGetPlant = (page, rows, userId, finish) => ajax2('/tea/getPlant', { page, rows, userId, finish }, 'GET')

//更新茶叶种植阶段信息
export const reqUpdatePlant = (tea) => ajax2('/tea/updatePlant', tea, 'POST')

//获取加工种植阶段信息
export const reqGetProcess = (page, rows, userId, finish) => ajax2('/tea/getProcess', { page, rows, userId, finish }, 'GET')

//更新加工种植阶段信息
export const reqUpdateProcess = (tea) => ajax2('/tea/updateProcess', tea, 'POST')

//获取仓储种植阶段信息
export const reqGetStorage = (page, rows, userId, finish) => ajax2('/tea/getStorage', { page, rows, userId, finish }, 'GET')

//更新仓储种植阶段信息
export const reqUpdateStorage = (tea) => ajax2('/tea/updateStorage', tea, 'POST')

//获取检测种植阶段信息
export const reqGetCheck = (page, rows, userId, finish) => ajax2('/tea/getCheck', { page, rows, userId, finish }, 'GET')

//更新检测种植阶段信息
export const reqUpdateCheck = (tea) => ajax2('/tea/updateCheck', tea, 'POST')

//获取验证码
export const reqVerify = () => ajax2('/verify/getVerify', {}, 'GET')

//验证验证码
export const reqCheckVerify = (verify) => ajax2('/verify/checkVerify', { verify }, 'GET')

//获取字典对应值
export const reqDictionaryByCond = (typeCode, valueId) => ajax2('/dictionary/getByCond', { typeCode, valueId }, 'GET')

//获取字典类型list
export const reqDictType = (typeCodes) => ajax2('/dictionary/getByType', { typeCodes }, 'GET')

//获取字典类型
export const reqDictTypePage = (cond) => {
    cond = JSON.stringify(cond)
    return ajax2('/dictionary/getType', { cond }, 'GET')
}

//获取字典类型
export const reqDictPage = (typeCode, valueId) => ajax2('/dictionary/get', { typeCode, valueId }, 'GET')

//新增字典类型
export const reqDictTypeAdd = (dictionary) => ajax2('/dictionary/addType', dictionary, 'POST')

//新增字典
export const reqDictAdd = (dictionary) => ajax2('/dictionary/add', dictionary, 'POST')

//更新字典类型
export const reqDictTypeUpdate = (typeCode, typeName) => ajax2('/dictionary/updateType', { typeCode, typeName }, 'GET')

//更新字典
export const reqDictUpdate = (dictionary) => ajax2('/dictionary/update', dictionary, 'POST')

//删除字典类型
export const reqDictTypeDelete = (typeCode) => ajax2('/dictionary/deleteType', { typeCode }, 'GET')

//删除字典
export const reqDictDelete = (id) => ajax2('/dictionary/delete', { id }, 'GET')

//检测字典名是否已存在
export const reqDictTypeName = (typeCode, valueId) => ajax2('/dictionary/name', { typeCode, valueId }, 'GET')

//获取茶叶类型
export const reqTeaType = () => ajax2('/dictionary/getTeaType', {}, 'GET')

//获取机构产品
export const reqOrgProduce = (org) => ajax2('/produce/getOrg', { org }, 'GET')

//产品分页
export const reqProducePage = (page, rows, cond) => {
    cond = JSON.stringify(cond)
    return ajax2('/produce/getPage', { page, rows, cond }, 'GET')
}

//产品分页
export const reqProduceLike = (typeId,org) =>  ajax2('/produce/getLike', { typeId,org }, 'GET')


//新增产品
export const reqProduceAdd = (produce) => ajax2('/produce/add', produce, 'POST')

//根据产品查询是否重复
export const reqProduceName = (name,org) => ajax2('/produce/name', { name,org }, 'GET')

//更新产品
export const reqProducUpdate = (produce) => ajax2('/produce/update', produce, 'POST')

//删除产品
export const reqProducDelete = (id) => ajax2('/produce/delete', { id }, 'GET')

//机构入住
export const reqOrgJoin = (org, staff) => ajax2('/org/join', { org, staff }, 'POST')

//新增机构
export const reqOrgAdd = (org) => ajax2('/org/add', org, 'POST')

//更新机构
export const reqOrgUpdate = (org) => ajax2('/org/update', org, 'POST')

//删除机构
export const reqOrgDelete = (id) => ajax2('/org/delete', { id }, 'GET')

//获取机构
export const reqOrg = (id) => ajax2('/org/get', { id }, 'GET')

//审核机构
export const reqOrgAuth = (id, state) => ajax2('/org/auth', { id, state }, 'GET')

//获取所有机构
export const reqOrgAll = (state) => ajax2('/org/getAll', { state }, 'GET')

//机构分页
export const reqOrgPage = (page, rows, place, state) => ajax2('/org/getPage', { page, rows, place, state }, 'GET')

//用户分页
export const reqStaffPage = (page, rows, cond) => {
    cond = JSON.stringify(cond)
    return ajax2('/staff/getPage', { page, rows, cond }, 'GET')
}
//检测用户名是否已存在
export const reqStaffName = (name) => ajax2('/staff/name', { name }, 'GET')

//更新用户
export const reqUpdateStaff = (staff) => ajax2('/staff/update', staff, 'POST')

//增加用户
export const reqAddStaff = (staff) => ajax2('/staff/add', staff, 'POST')

//更新用户密码
export const reqUpdatePassword = (id, password) => ajax2('/staff/password', { id, password }, 'GET')

//删除用户
export const reqDeleteStaff = (id) => ajax2('/staff/delete', { id }, 'GET')

//角色分页
export const reqRolePage = (page, rows) => ajax2('/role/getPage', { page, rows }, 'GET')

//获取所有角色
export const reqRoleAll = () => ajax2('/role/getAll', {}, 'GET')

//删除角色
export const reqDeleteRole = (id) => ajax2('/role/delete', { id }, 'GET')

//增加角色
export const reqAddRole = (role) => ajax2('/role/add', role, 'POST')

//通过名字查询角色
export const reqFindRoleByName = (name) => ajax2('/role/findByName', { name }, 'GET')

//通过id查询角色
export const reqFindRole = (id) => ajax2('/role/find', { id }, 'GET')

//更新角色
export const reqUpdateRole = (role) => ajax2('/role/update', role, 'POST')

//资讯分页
export const reqNewsPage = (page, rows, cond) => {
    cond = JSON.stringify(cond)
    return ajax2('/news/getPage', { page, rows, cond }, 'GET')
}

//增加资讯
export const reqAddNews = (news) => ajax2('/news/add', news, 'POST')

//更新资讯
export const reqUpdateNews = (news) => ajax2('/news/update', news, 'POST')

//更新资讯
export const reqDeleteNews = (id) => ajax2('/news/delete', { id }, 'GET')

//增加资讯记录
export const reqAddNewsDetail = (newsDetail) => ajax2('/newsDetail/add', newsDetail, 'POST')

//获取资讯记录
export const reqNewsDetailByCond = (cond) => {
    cond = JSON.stringify(cond)
    return ajax2('/newsDetail/getByCond', { cond }, 'GET')
}
//获取用户资讯记录
export const reqNewsDetailUser = (news, user) => ajax2('/newsDetail/getUser', { news, user}, 'GET')

//更新用户资讯记录
export const reqUpdateNewsDetail = (newsDetail) => ajax2('/newsDetail/updateUser', newsDetail, 'POST')

//更新资讯 用户互动
export const reqUpdateNewsUser = (news) => ajax2('/news/updateUser', news, 'POST')

//获取用户分析
export const reqStaffChart = (cond) =>{
    cond = JSON.stringify(cond)
   return ajax2('/staff/chart', {cond}, 'GET')
} 

//获取系统监控
export const reqServer = () => ajax2('/monitor/server', {}, 'GET')