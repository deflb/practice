let a = { // 松散相等 将隐式转换 (不适用于 全等(不进行隐式转换))
    _a: 1,
    valueOf(){
        return this._a++
    }
}

// Object.defineProperty(window, 'a', { // 松散相等 全等 都适用
//     get() {
//         !this._a && (this._a = 1)
//         return this._a++
//     }
// })
console.log(a == 1 && a == 2)