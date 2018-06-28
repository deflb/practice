'use strict';

Object.defineProperty(exports, 'c', {
    // enumerable: true,
    // writable: true,
    // configurable: true,
    // value: 123,
    get: function () {
        return this._c
    },
    set: function (newValue) {
        console.log(newValue)
        this._c = newValue
    }
})

function a() {
    console.log('a')
}

const b = { // 定义对象属性 getter setter ES6 写法
    _b: '_b',
    get ['__b'](){
        return this._b
    },
    set ['__b'](value) {
        console.log(value)
        // 对该属性进行修改时 将执行set 中的逻辑
        this._b = value
    }
}

exports.c = 456
console.log(exports.c)

module.exports = {
    a,
    b,
}