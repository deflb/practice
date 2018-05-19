class a {
    constructor(param){
        let {name} = param
        this.name = name
    }
    output(){
        console.log(this)
    }
}

class b extends a{
    constructor(props){
        super(props)
    }
}

let param = {name: '小明'}
// console.log({...param})
let obj = new a(param)
obj.output()

let obj1 = new b({name: '小张'})
obj1.output()