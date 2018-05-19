function stringToNumber(str){ // 期望不符合 生成 NaN 使用 一元操作进行转换
    console.log(parseInt(str))
    console.log(parseFloat(str))
    console.log(Number(str)) 
    console.log(~~str)
    // 一元操作
    console.log(str * 1)
    console.log(str / 1) 
    console.log(str - 0)
    console.log(+str)
}

stringToNumber('12.s')