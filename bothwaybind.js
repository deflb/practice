function canUseDefineProperty() {
    let flag = false;
    try {
        Object.defineProperty({}, 'a', {
            value: null
        })
        flag = true
    } catch (error) {
        flag = false
    }
    return flag
}

function isObject(val) {
    return val !== null && typeof val === 'object'
}

if (canUseDefineProperty()) {
    function _observe(obj) {
        for (let key in obj) {
            let value = obj[key]
            isObject(value) && _observe(value)
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return value
                },
                set(newValue) {
                    if (value !== newValue)
                        value = newValue
                }
            })
        }
    }
}

let obj = { a: 1, b: { bb: 2 } }
_observe(obj)
console.log(obj.a)
obj.a = 2
console.log(obj.a)
