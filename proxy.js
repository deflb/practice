let obj = new Proxy({ a: 10, b: 20 }, { // 定义基本操作的自定义行为 -> 加一层壳
    get: function (target, value) {
        return target[value]
    },
    set: function (target, value, newValue) {
        target[value] = newValue
    }
})
// console.log(obj.a)
// obj.a = 100
// console.log(obj.a)

let obj1 = {
    _a: 1,
    get a() {
        return this._a
    },
    set a(value) {
        this._a = value
    }
}
// console.log(obj1.a)
// obj1.a = 10
// console.log(obj1.a)


let obj2 = {}
Object.defineProperty(obj2, 'a', {
    enumerable: true,
    configurable: true,
    get() {
        this._a === undefined && (this._a = 1)
        return this._a
    },
    set(value) {
        this._a = value
    }
})
// console.log(obj2.a)
// obj2.a = 10
// console.log(obj2.a)

let obj3 = {}
Object.defineProperties(obj3, {
    a: {
        enumerable: true,
        configurable: true,
        get() {
            this._a === undefined && (this._a = 1)
            return this._a
        },
        set(value) {
            this._a = value
        }
    },
    b: {
        enumerable: true,
        configurable: true,
        get() {
            this._b === undefined && (this._b = 2)
            return this._b
        },
        set(value) {
            this._b = value
        }
    },
    c: {
        value: 3,
        writable: false,
        enumerable: false,
        configurable: false,
    }
})
console.log(obj3.a)
console.log(obj3.b)
delete obj3.c
console.log(obj3.c)
obj3.c = 30
console.log(obj3.c)
console.log(Object.keys(obj3))
console.log(Object.getOwnPropertyNames(obj3))

console.log('123456789'.slice(-4, -3)) // start -> end  start不能大于end 为负从后往前
console.log('123456789'.substr(-4, 1)) // from length  length 必须大于0  from 为负从后往前
console.log('123456789'.substring(1, -3)) // start -> end 不能同时为负  start>end -> (start,end) start<end -> (end, start)

console.log([1, 2, 3].splice(-1, 1)) // start 为负从后往前 返回删除的子项
console.log([1, 2, 3, 4, 5].slice(1, -1)) // start 不能为负 end 为负从后往前