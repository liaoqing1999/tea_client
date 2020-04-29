
export default {
    //存储
    save (key,value) {
        sessionStorage.setItem(key,JSON.stringify(value))
    },
    //获取
    get(key) {
        return JSON.parse(sessionStorage.getItem(key))
    },
    //移除
    remove(key) {
        sessionStorage.removeItem(key)
    },
    //清除
    clear() {
        sessionStorage.clear()
    },
}