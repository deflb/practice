(function () {
    function init(selector) { // selector 一般都为DOM元素,DOM选择器
        this.selector = selector;
        if (typeof selector === 'function') { // 为方法时 $(function(){...}) 等价于 $(document).ready(function(){...})
            this.ready(selector)
        } else if (typeof selector === 'string') { // 为string时 即 选择器时
            this.select(selector)
        } else if (selector.nodeType === 1) { // 为DOM 元素 时
            this[0] = selector
            this.context = selector
            this.length = 1
        }
    }
    init.prototype = $.prototype // 关键 初始化构造函数原型 继承 $原型

    function $(selector = document) {
        return new init(selector) // 创建实例并初始化
    }

    // 类中 的 方法或属性
    $.extends = $.prototype // 方法插件 扩展 即挂载到 $原型
    $.format = function () {
        console.log('is $ format fun')
    }
    $.each = function (items, fn) {
        for (let i = 0; i < items.length; i++) {
            fn(items[i])
        }
    }

    // 原型 上的 属性 或 方法
    $.prototype.undefined = void 0;
    $.prototype.ready = function (fn) {
        document.addEventListener('DOMContentLoaded', fn)
    }
    $.prototype.select = function (selector) {
        let nodeList = document.querySelectorAll(selector), length = nodeList.length
        for(let i = 0; i<= length - 1; i++){
            this[i] = nodeList[i]
        }
        this.context = document
        this.length = length // length 即 起到结果条数展示 又是 遍历时的 限制条件
    }
    $.prototype.text = function (text) {
        this[0].textContent = text
        return this;
    }
    $.prototype.html = function (html) {
        this[0].innerHTML = html
    }
    $.prototype.each = function (fn) {
        for (let i = 0; i <= this.length - 1; i++) {
            fn(this[i], i)
        }
    }
    $.prototype.hide = function () {
        this[0].style = 'display: none';
    }
    $.prototype.show = function () {
        this[0].style = 'display: block';
    }
    $.prototype.click = function (fn) {
        this[0].addEventListener('click', fn)
    }
    $.prototype.attr = function (name, value) {
        if (value === this.undefined)
            return this[0].getAttribute(name)
        else {
            value = (value === null || value === '') ? '' : value + ''
            this[0].setAttribute(name, value)
            return this
        }
    }
    $.prototype.fadeIn = function (time = 500) {
        this[0].style.display = 'block'
        let opacity = 0, timeId = setInterval(() => {
            opacity += 0.1
            if (opacity <= 1) {
                this[0].style.opacity = opacity
            } else
                clearInterval(timeId)
        }, time/10)
    }
    $.prototype.fadeOut = function (time = 500) {
        let opacity = 1, timeId = setInterval(() => {
            opacity = (opacity - 0.1).toFixed(1)
            if (opacity >= 0) {
                this[0].style.opacity = opacity
            } else{
                this[0].style.display = 'none'
                clearInterval(timeId)
            }
        }, time/10)
    }
    $.prototype.format = function () {
        console.log('is $ format fun')
    }
    // ...

    window.$ = $ // 实例化到window中
})()