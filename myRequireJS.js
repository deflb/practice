(function () {
    const toString = Object.prototype.toString;
    function isArray(param) {
        return toString.call(param) === '[object Array]'
    }
    function isFunction(param) {
        return toString.call(param) === '[object Function]'
    }
    function throwError(message) {
        throw new Error(message)
    }
    function findInObjectArr(objectArr, findKey, findVal) {
        for (let i = 0, len = objectArr.length; i < len; i++) {
            if (objectArr[i][findKey] === findVal)
                return i
            if (i >= len)
                return -1
        }
    }

    let param = [], // 文件名称存储
        modules = [], // 模块存储
        configItem = []; // 没用 define 包装的 模块 配置项

    function require(...props) {
        let firstMeta = props[0]
        if (isArray(firstMeta)) {
            let _firstMeta = [...new Set(firstMeta)] // 去重
            if (_firstMeta.length !== firstMeta.length)
                throwError('require module has repeat, please check!')
            firstMeta.forEach((item, index) => {
                let name = item.match(/\w+(?=\.js)/)[0];
                param.push(name)
                let script = document.createElement('script');
                script.type = 'text/javascript'
                script.charset = 'utf-8'
                script.src = item
                script.id = name
                script.onload = (e) => {
                    if (findInObjectArr(configItem, 'name', name) > -1) // 对于 没用 define 包装的 模块 先占位
                        modules.push(null)
                    if (index >= firstMeta.length - 1) {
                        props[1](...param.map(
                            (value, key) => {
                                if (findInObjectArr(configItem, 'name', value) > -1) {
                                    return window[configItem[findInObjectArr(configItem, 'name', value)].alias]
                                } else
                                    return modules[key]
                            }))
                    }
                }
                document.body.appendChild(script)
            });
        } else if (isFunction(firstMeta)) {
            firstMeta()
        } else
            throwError('arguments type is no support')
    }

    require.config = function (props) { // 对于 没用 define包装的模块 配置项
        configItem = props
    }

    function define(...props) {
        let firstMeta = props[0];
        if (isArray(firstMeta))
            require(firstMeta)
        else if (isFunction(firstMeta)) {
            modules.push(firstMeta())
        } else
            throwError('arguments type is no support')
    }

    window.require = require
    window.define = define
}())