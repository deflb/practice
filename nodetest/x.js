let a = [1, 2, 3];
console.log(a.map(item => item + '=').join('&'))
console.log(a)

console.log('name=1&age=2'.split('&')[1].replace(/\+/g, '%20'))

console.log(Array.prototype.reduce.call([{ a: 1, b: 10 }, { a: 5 }, { a: 3 }], (pre, next) => {
    return pre += next.a
}, 0))

let arr = [1, 2, 3, 4];
console.log(arr.slice(-1))
console.log(arr)
console.log(arr.splice(0, 0)) // 返回被删除的元素 改变原数组
console.log(arr)

let p = () => new Promise((resolve, reject) => {
    // setTimeout(() => resolve(123), 0)
    setTimeout(() => reject(456), 0)
})

// then 接受两个函数 作为 参数 第一个参数 处理 onfulfilled状态 第二个参数 处理 onrejected状态
p().then(null, err => { console.log(err) }) // 等价 catch 为 then 的语法糖
p().catch(err => { console.log(err) })


let str = '';
for (let x = 1; x <= 9; x++) {
    for (let y = 1; y <= x; y++) {
        str += x + 'x' + y + '=' + x * y + ' '
    }
    str += ' '
}
console.log(str)