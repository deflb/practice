// function p() {
//     return new Promise((resolve, reject) => {
//         resolve({ data: 'is success' })
//         reject({ error: 'is error' })
//     })
// }

// p().then((data) => {
//     console.log(data)
// }).catch((error) => {
//     console.log(error)
// })

function step1() {
    return new Promise((reslove) => {
        setTimeout(() => {
            console.log('step1')
            reslove('step1')
        }, 5000)
    })

}
async function step2(i = '') { // async 会自动reslove封装函数返回值 返回一个Promise 对象
    console.log(i + 'step2')
    return 'step2'
}

function step3() {
    return new Promise((reslove, reject) => {
        setTimeout(() => {
            reject(2)
        }, 1000)
    })
}

async function a() { // async await 是 Promise 的语法糖  用同步的写法 代替 Promise then链的写法 用try catch 代替 catch错误捕捉及处理
    try {
        console.log('before step1');
        let _step1 = await step1(); // await (async wait) 必须处于 async 函数上下文中 相当于一个 运算符 其后可 接受 Promise 对象 或者 原始类型 的返回
        console.log('after step1');
        let _step2 = await step2();
        step2().then(v => {console.log(v)})
        for (let i = 0; i < 3; i++) { // await 可进行 循环 执行
            await step2(i)
        }
        console.log(_step1, _step2)
        try {
            await step3();
        } catch (error) {
            console.log(error)
        }
        console.log('step3')
    } catch (error) { // try catch 处理错误  -- await 接受到 reject 的返回 会主动抛出 错误
        console.log(error)
    }
}
a()
