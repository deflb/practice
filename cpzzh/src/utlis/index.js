const setCookie = (name, value, time = 0) => {
    let cookie = [`${name}=${encodeURIComponent(value)}`, 'path=/']
    if (time !== 0) {
        let exp = new Date();
        exp.setTime(exp.getTime() + time * 60 * 1000);
        cookie.push(`expires=${exp.toGMTString()}`)
    }
    document.cookie = cookie.join(';')
}
const getCookie = (name) => {
    let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"),
        arr = document.cookie.match(reg);
    if (arr)
        return decodeURIComponent(arr[2]);
    else
        return null;
}
const delCookie = (name) => {
    setCookie(name, '', -1)
}

const formatDate = (date, fmt = 'YYYY-MM-DD') => {
    let o = {
        "M+": date.getMonth() + 1, //月份
        "D+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

const regExp = {
    intagerReg: /^(0?|[1-9][0-9]*)$/,
    floatReg: /^(0?|[1-9][0-9]*)?(\.(\d*))?$/,
    allNumber: /^\d+$/,
    phone: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
    email: /^\w+([-+.])*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    removeEmpty: /\s/g,
}

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component';
const isBoolean = val => Object.prototype.toString.call(val) === '[object Boolean]'
const isString = val => Object.prototype.toString.call(val) === '[object String]'
const isObject = val => Object.prototype.toString.call(val) === '[object Object]'

export {
    setCookie,
    getCookie,
    delCookie,
    formatDate,
    regExp,
    getDisplayName,
    isBoolean,
    isString,
    isObject
}