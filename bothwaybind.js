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

function isObject(val){
    return val !== null && typeof val === 'object'
}

if (canUseDefineProperty()) {
    function _observe(obj) {
        let value;
        for (let key in obj) {
            value = obj[key]
            isObject(value) && _observe(value)
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get(value) {
                    console.log('is get value')
                    return value
                },
                set(newValue) {
                    console.log(newValue)
                    if (value !== newValue)
                        value = newValue
                }
            })
        }
    }
}

let obj = { a: 1, b: {bb: 2} }
_observe(obj)
obj.a = 2
