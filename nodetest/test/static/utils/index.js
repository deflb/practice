import {
    isString,
    throwError,
    findSome,
    getViewWidthAndHeight,
    throttle,
} from './base.js';

const loadingImgByIO = function (eleSelector) { // img container selector
    if (isString(eleSelector)) {
        let ele = document.querySelectorAll(eleSelector)
        if (!ele) return;
        let opts = {
            threshold: [0, 1], // 元素在可视窗口中的比例
            // root: element,
            // rootMargin: top right bottom left;
        }, observe = new IntersectionObserver(callback, opts);
        ele.forEach(item => {
            observe.observe(item)
        })
        // observe.unobserve(ele); // 停止观察
        // observe.disconnect(); // 关闭观察器
        function callback(entries) {
            entries.forEach(item => {
                let _imgGather = item.target.querySelectorAll('img')
                if (item.intersectionRatio > 0 && findSome(_imgGather, img => img.src !== img.getAttribute('origin'))) {
                    _imgGather.forEach(img => {
                        img.src = img.getAttribute('origin')
                    })
                }
            })
        }
    }
}
const loadingImgByScroll = function (eleSelector) { // img container selector
    if (isString(eleSelector)) {
        let ele = document.querySelectorAll(eleSelector)
        if (!ele) return;
        let _body = document.body,
            loopJudgeFn = function () {
                let _viewHeight = getViewWidthAndHeight().h
                ele.forEach(item => {
                    let _itemTop = item.getBoundingClientRect().top,
                        _img = item.querySelectorAll('img');
                    if (_itemTop <= _viewHeight && findSome(_img, function (img) { return img.src !== img.getAttribute('origin') })) {
                        _img.forEach(img => {
                            img.src = img.getAttribute('origin')
                        })
                    }
                })
            };
        loopJudgeFn() // 页面初始化 可视窗口内的图片
        _body.onscroll = throttle(loopJudgeFn)
    } else
        throwError('document selector must a string')
}
export {
    loadingImgByIO,
    loadingImgByScroll,
}