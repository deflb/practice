let str = '{{name}}现在{{age}}岁'
let obj = { age: 18, name: '小明' }

String.prototype.render = function (obj) {
    return this.replace(/{{(.*?)}}/g, (match, key) => obj[key.trim()])
}
console.log(str.render(obj))