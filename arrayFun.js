const reduce = Array.prototype.reduce;

// reduce -- 替代 map
function replaceMap(arr, renderFn) {
    return reduce.call(arr, (outData, currentValue) => {
        return renderFn(currentValue)
    }, 0)
}
replaceMap([1, 2, 3], (item) => { console.log(item) })

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

let simpleArr =  takeOutRepetition([1, 2, 2, 3, 3])