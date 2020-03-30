
import store from 'store'
/*
进行Local数据存储管理工具
store 兼容所以浏览器
*/
const USER_KEY = 'user_key'
export default{
    /*保存user*/
    savaUser(user){
        //localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY,user)
    },
    /*获取user*/
    getUser(){
        //return JSON.parse(localStorage.getItem(USER_KEY)||'{}') 
        return store.get(USER_KEY) || {}
    },
    removeUser(){
        //localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
    /*移除user*/
}