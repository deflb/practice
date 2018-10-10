class _promise { // promise -> 状态机(onfulfilled, onrejected)
    constructor(props) {
        this.f = props
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
        this.then = this.then.bind(this)
        this.catch = this.catch.bind(this)
        this.init()
    }
    init() {
        let timer = setTimeout(() => {
            this.f(this.resolve, this.reject)
            clearTimeout(timer)
        }, 0)
    }
    resolve(props) {
        this.fulfilledData = props;
        for (let i = 0; i < this.onfulfilled.length; i++) {
            let newData = this.onfulfilled[i](this.fulfilledData)
            this.fulfilledData = void 0;
            if (newData) this.fulfilledData = newData
        }
    }
    reject(props) {
        this.rejectData = props;
        this.onrejected[0](this.rejectData)
    }
    then(onfulfilled, onrejected) {
        if (!this.onfulfilled) this.onfulfilled = []
        onfulfilled && (this.onfulfilled.push(onfulfilled))

        if (!this.onrejected) this.onrejected = []
        onrejected && (this.onrejected.push(onrejected))
        return this;
    }
    catch(onrejected) {
        this.then(null, onrejected)
        return this;
    }
}

let p = new _promise(function (resolve, reject) {
    let timer = setTimeout(function () {
        resolve('is resolve')
        clearTimeout(timer)
    }, 1000)
    // resolve('is resolve')
    // reject('is reject')
})

p.then((data) => {
    console.log(data)
    return 'is cope'
}).then((data) => {
    console.log(data)
    // return 'is xxxx'
}).then((data) => {
    console.log(data)
}).catch((err) => {
    console.log(err)
}).catch((err) => {
    console.log(err)
}).then((data) => {
    console.log(data)
})

console.log('123')