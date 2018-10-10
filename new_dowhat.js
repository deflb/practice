function t(a) {
    this.a = a
}
t.prototype.output = function () {
    console.log(this.a)
}

let _t = new t('is a')

// new 做了什么

// 1. 创建一个对象 且其原型继承该构造函数
let newObject = Object.create(t.prototype); // 该对象具有原型方法或属性
// 2. 临时改变构造函数this指向,且传入外部参数
t.call(newObject, 'is a') // 该对象具有构造函数内的方法或属性
// 3. 返回上述创建的对象
let __t = newObject

// 对于构造函数有返回的情况(
//     返回类型: 引用类型 -> 创建的实例就是返回的引用类型的值
//              原始类型 -> 创建的实例为上述逻辑创建的对象
// )
function a(b) {
    this.b = b
    return [1,2]
}
a.prototype.do = function () {
    console.log(this.b)
}
let _a = new a('is b')