import routerBase from './routerBase';

const _routerDictionary = {
    '/personalCenter': '个人中心',
    '/personalCenter/grade': '我的等级',
    '/personalCenter/collect': '我的收藏',
    '/personalCenter/suggestionFeedback': '意见反馈',
    '/personalCenter/integral': '积分商城',
    '/personalCenter/message': '消息中心',
    '/personalCenter/message/detail': '消息详情',
    '/personalCenter/discountCoupon': '我的优惠券',
    '/personalCenter/discountCoupon/getCoupon': '领券中心',
    '/nearbyShop': '附近门店',
    '/nearbyShop/detail': '附近门店',
    '/onlineCustomService': '在线客服',
    '/myOrder': '我的订单',
    '/myAfterSale': '我的售后',
    '/myAfterSale/apply': '申请售后',
    '/moreCase': '万套案例',
    '/moreCase/palette': '色板详情',
    '/moreCase/mountings': '配件详情',
    '/checkTrue': '产品验真',
    '/showHome': '晒家有礼',
    '/showHome/detail': '晒家详情',
    '/showHome/add': '晒家',
    '/showHome/add/selectHouses': '选择楼盘',
    '/showHome/add/selectHouses/switchCity': '选择城市',
};

let routerDictionary = {};

if (routerBase === '')
    routerDictionary = _routerDictionary;
else
    Object.keys(_routerDictionary).forEach(item => {
        routerDictionary[routerBase + item] = _routerDictionary[item]
    })


export default routerDictionary