const reduce = Array.prototype.reduce;

// reduce -- 替代 map
function replaceMap(arr, renderFn) {
    return reduce.call(arr, (outData, currentValue) => {
        outData.push(renderFn(currentValue))
        return outData
    }, [])
}
let mapRes = replaceMap([1, 2, 3], (item) => item * 2)

// reduce -- 替代 filter
function replaceFilter(arr) {
    return reduce.call(arr, (outData, currentValue) => {
        if (currentValue > 10)
            outData.push(currentValue)
        return outData
    }, [])
}
let filterRes = replaceFilter([8, 9, 10, 11, 23])

// Set 数组去重 
function takeOutRepetition(arr) {
    return [...new Set(arr)]
}

let simpleArr = takeOutRepetition([1, 2, 2, 3, 3])

// 利用length 从数组尾部删除元素
function delItemByChangeLength(arr, len) {
    arr.length = len
    return arr
}
let delArr = delItemByChangeLength([1, 2, 3, 4], 2)

// JSON -> stringify | parse
console.log(JSON.stringify({ a: 123 }, (key, value) => { value.b = 456; return value }))
console.log(JSON.parse('{ "a": 123 }', (key, value) => { value.b = 456; return value }))

// 解构 获取数组元素
function getArrItemByDecs() {
    let str = 'he is jike';
    let { 2: name } = str.split(' ')
    console.log(name)
}
getArrItemByDecs()

// 函数参数 默认值 以及 参数是否可选
function a({ name = 'jike', age = 18 } = {}) { console.log(name + age) }
a()
a({name: 'joe'})

// 平铺数组 concat 打散 & 展开运算符 打散
console.log([].concat(...[1,[2],[3,4]]))