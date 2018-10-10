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
a({ name: 'joe' })

// 平铺数组 concat 打散 & 展开运算符 打散
console.log([].concat(...[1, [2], [3, 4]]))

function compareArr(arr1, arr2) { // arr2 以 arr1 为基准 进行增删
    return arr1.map(item => {
        let findItem = arr2.find(val => val.key === item)
        return findItem ? findItem : { key: item }
    })
}
console.log(...compareArr(['a', 'b', 'c'], [{ key: 'a' }, { key: 'b' }]))

function arrCountLen(arr) { // 数组最大连续长度
    let result = [], start = 0;
    arr.push(arr[arr.length - 1] + 2)
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] - arr[i - 1] !== 1) {
            result.push({
                source: arr.slice(start, i),
                len: i - start
            })
            start = i
        }
    }
    let maxLength = Math.max(...result.map(item => item.len));
    return {
        maxLength,
        source: result.filter(item => item.len === maxLength)
    }
}
arrCountLen([0, 1, 2, 3, 5, 6, 8, 9, 10, 11, 13])

'btnHotTapBp'.replace(/[A-Z]/g, (v) => '-' + v).toLowerCase()
'btn-hot-bp-ht'.replace(/-\w/g, (v) => v.replace('-', '').toUpperCase())

let aa = [1, 2, 3];
console.log(aa.map(item => item + '=').join('&'))
console.log(aa)

console.log(Array.prototype.reduce.call([{ a: 1, b: 10 }, { a: 5 }, { a: 3 }], (pre, next) => {
    return pre += next.a
}, 0))

let arr = [1, 2, 3, 4];
console.log(arr.slice(-1))
console.log(arr)
console.log(arr.splice(0, 0)) // 返回被删除的元素 改变原数组
console.log(arr)

let p = () => new Promise((resolve, reject) => {
    setTimeout(() => resolve(123), 0) // Promise 只能有一种 状态 onfulfilled | onrejected
    setTimeout(() => reject(456), 0) // 此处将不执行
})

// then 接受两个函数 作为 参数 第一个参数 处理 onfulfilled状态 第二个参数 处理 onrejected状态
p().then(res => { console.log(res) }, err => { console.log(err) }) // 等价 catch 为 then 的语法糖
p().catch(err => { console.log(err) })


let str = '';
for (let x = 1; x <= 9; x++) {
    for (let y = 1; y <= x; y++) {
        str += x + 'x' + y + '=' + x * y + ' '
    }
    str += ' '
}
console.log(str)

// 多维数组转一维
console.log(JSON.parse(`[${JSON.stringify([1, [2, [3, [4, ['5']]]]]).replace(/\[|]/g, (val) => {
    console.log(val)
    return ''
})}]`))

function loop(item) {
    return Array.isArray(item) ? [].concat(...item.map(loop)) : item
}
console.log(loop([1, [2, [3, [4, ['5']]]]]))

console.log('a123456_b'.replace(/^(.{1}).+(.{1})$/, ($0, $1, $2) => {
    return $1 + '****' + $2
}))

function getRandom(min, max) {
    return Math.random() * (max - min) + min
}

function formatToDateTime({ val = '', ymdSeparator = '-', hmsSeparator = ':', hasTime = false }) {
    if (reg.allNumber.test(val)) {
        const date = new Date(val),
            ymd = [date.getFullYear(), date.getMonth() + 1, date.getDay()],
            hms = [date.getHours(), date.getMinutes(), date.getSeconds()],
            formatYmd = ymd.join(ymdSeparator).replace(/\d{1}/g, (props) => {
                console.log(props)
                return 'xx'
            }),
            formatHms = hms.join(hmsSeparator);
        if (!hasTime) return formatYmd
        return formatYmd + ' ' + formatHms
    } else
        return val
}

console.log(new Date(2018,10,1,8,30,30),Date.now())