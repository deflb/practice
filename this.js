console.log(this === global)

function a(name){
    // console.log(this)
    this.name = name
    this.fun = function (){
        return () => {
            console.log(this.name)
        }
    }
}

a.prototype.render = function (){
    // console.log(this)
}

let obj = new a('小明')
console.log(obj.fun()(), obj.render())