function stringToNumber(str) {
    console.log(parseInt(str))
    console.log(parseInt('1a', 16)) //试图返回一个整数 第二个参数 基数
    console.log(parseFloat(str))
    console.log(parseFloat(1.25))
    console.log(Number(str))
    console.log(Number(false))
    console.log(Number(true))
    console.log(Number(null))
    console.log(String(null))
    // console.log(null.toString())
    console.log(Boolean(0))
    console.log(Boolean(''))
    console.log(Boolean())
    console.log(Boolean(1))
    console.log(~~str)
    // 一元操作
    console.log(str * 1)
    console.log(str / 1)
    console.log(str - 0)
    console.log(+str)

    // 转换函数 
    // parseInt parseFloat
    // 强制转换
    // Number String Boolean toString(不可转null)
    // 利用 js 弱类型 隐式转换
    // 一元操作 或者 数学运算
}

stringToNumber('s12.05s')