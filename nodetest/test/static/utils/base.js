const toString = Object.prototype.toString;
const isString = function (str) {
    return toString.call(str) === '[object String]'
}
const throwError = function (msg) {
    throw new Error(msg)
}
const findSome = function (gather, fn) { // 类似 es6 array some (可适用于集合)
    try {
        let len = gather.length;
        for (let i = 0; i < len; i++) {
            if (fn(gather[i]))
                return true
            if (i >= len)
                return false
        }
    } catch (error) {
        throwError(error)
    }
}
const findEvery = function (gather, fn) { // 类似 es6 array every (可适用于集合)
    try {
        let len = gather.length;
        for (let i = 0; i < len; i++) {
            if (!fn(gather[i]))
                return false
            if (i >= len)
                return true
        }
    } catch (error) {
        throwError(error)
    }
}
const debounce = function (fn, delay = 170) { // 防抖动
    let time = null;
    return function (e) { // this -> 直接指向函数调用者
        clearTimeout(time);
        time = null;
        time = setTimeout(fn.bind(this, e), delay)
    }
}
const throttle = function (fn, delay = 170) { // 节流
    let time = null,
        start = new Date();
    return function () {
        clearTimeout(time)
        time = null;
        let current = new Date();
        if (current - start > delay) {
            fn()
            start = current
        } else // 事件脱离 依旧执行一次
            time = setTimeout(fn, delay)
    }
}
const getHtmlWidthAndHeight = function () { // 获取整张html宽高
    return {
        w: document.body.scrollWidth,
        h: document.body.scrollHeight
    }
}
const getViewWidthAndHeight = function () { // 获取浏览器可视窗口宽高
    return {
        w: window.innerWidth || document.body.offsetWidth,
        h: window.innerHeight || document.body.offsetHeight,
    }
}

export {
    isString,
    throwError,
    findSome,
    findEvery,
    throttle,
    debounce,
    getHtmlWidthAndHeight,
    getViewWidthAndHeight,
}