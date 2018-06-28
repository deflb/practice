const toString = Object.prototype.toString
const setCookie = (name, val, exp) => {
    let now = new Date();
    now.setTime(now.getTime() + exp);
    let expires = 'expires=' + now.toGMTString(),
        path = 'path=/',
        httpOnly = 'httpOnly';
    return name + '=' + escape(val) + ';' + expires + ';' + path + ';' + httpOnly
}
const parseCookie = (name, cookie) => {
    let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"),
        arr = cookie.match(reg);
    if (arr)
        return unescape(arr[2]);
    else
        return null;
}

module.exports = {
    toString,
    setCookie,
    parseCookie
}