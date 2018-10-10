// async await 是 Promise 的语法糖  用同步的写法 代替 Promise then链的写法 用try catch 代替 catch错误捕捉及处理
async function test1() {
    return 'test'
}
function test2() {
    return Promise.resolve('test')
}
// test1 等价于 test2
test1().then(data => { console.log(data) })
test2().then(data => { console.log(data) })

async function test3() {
    throw 'err'
}
function test4() {
    return Promise.reject('err')
}
// test3 等价于 test4
// test3().catch(err => { console.log(err) })
// test4().catch(err => { console.log(err) })

async function errHandler() {
    try {
        let data = await Promise.reject('123') // await 会将后面(promise,原始类型,引用类型)的数据 装换成可用的值 (原始类型,引用类型使用原值, promise 取被 reslove | reject 包装的值)
    } catch (error) {
        console.log(error)
    }
}
// errHandler()


// a -> b -> c
function step(info) {
    return new Promise((reslove, reject) => {
        let timer = setTimeout(function () {
            reslove(info)
            clearTimeout(timer)
        }, 1000)
    })
}
step('a').then(data => {
    console.log(data)
    step('b').then(data => {
        console.log(data)
        step('c').then(data => {
            console.log(data)
        }).catch(err => { console.log(err) })
    }).catch(err => { console.log(err) })
}).catch(err => { console.log(err) })

step('a').then(data => {
    console.log(data)
    return data
}).then(data => {
    console.log(data)
    step('b').then(data => {
        console.log(data)
        return data
    }).then(data => {
        console.log(data)
        step('c').then(data => {
            console.log(data)
        })
    })
})

// 上述两种then链写法与下述await写法等价 两者相比 await写法逻辑更清晰
async function f() {
    try {
        let a = await step('a');
        console.log(a)
    } catch (error) {
        console.log(error)
    }
    try {
        let b = await step('b');
        console.log(b)
    } catch (error) {
        console.log(error)
    }
    try {
        let c = await step('c');
        console.log(c)
    } catch (error) {
        console.log(error)
    }
}
// f()

async function t() {
    let a = await step('a')
    console.log(a)
    let b = await 'b'
    console.log(b)
    let c = await 'c'
    console.log(c)
    console.log(await null)
    console.log(await undefined)
    console.log(await { d: 1 })
    console.log(await [1, 2, 3])
}
// t()

async function b() { // 并行
    let all = await Promise.all([step('a'), step('b'), step('c')])
    console.log(all)
}
b()