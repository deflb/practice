function $(){
    this.a =1;
    this.b =2;
}

$.prototype = {
    c: 3,
    d: function (){

    }
}

let _$ = new $()
Object.defineProperty(_$, 'a', {
    enumerable: false, // 可枚举
    writable: false, // 可读写
    configurable: false // 可配置 -- 删除
})

delete _$.a
console.log(_$)

console.log(Object.keys(_$)) // 不会触及到原型上的属性 不可读取不可枚举的属性键

for(let k in _$){ // 触及到原型上的属性 不可读取不可枚举的属性键
    console.log(k)
}

console.log(Object.getOwnPropertyNames(_$)) // 不触及原型上的属性 内部属性键都可读取