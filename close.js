let a = function (){
    let param = 1
    return function (ref){
        return param+=ref
    }
}

console.log(a()(2))
console.log(a()(2))