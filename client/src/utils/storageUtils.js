
import store from 'store'
/*
进行Local数据存储管理工具
store 兼容所以浏览器
*/
const USER_KEY = 'user'
const ROLE_KEY = 'role'
const REMEBER_KEY = 'remeber'
export default {
    /*保存user*/
    savaUser(user) {
        //localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY, user)
    },
    /*获取user*/
    getUser() {
        //return JSON.parse(localStorage.getItem(USER_KEY)||'{}') 
        return store.get(USER_KEY) || {}
    },
    /*移除user*/
    removeUser() {
        //localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    },
    /*保存role*/
    savaRole(role) {
        //localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(ROLE_KEY, role)
    },
    /*获取role*/
    getRole() {
        //return JSON.parse(localStorage.getItem(USER_KEY)||'{}') 
        return store.get(ROLE_KEY) || {}
    },
    /*移除role*/
    removeRole() {
        //localStorage.removeItem(USER_KEY)
        store.remove(ROLE_KEY)
    },
    /*保存user*/
    savaRemeber(remeber) {
        //localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(REMEBER_KEY, remeber)
    },
    /*获取user*/
    getRemeber() {
        //return JSON.parse(localStorage.getItem(USER_KEY)||'{}') 
        return store.get(REMEBER_KEY) || {}
    },
    /*移除user*/
    removeRemeber() {
        //localStorage.removeItem(USER_KEY)
        store.remove(REMEBER_KEY)
    }
}