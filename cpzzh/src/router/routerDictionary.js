import routerBase from './routerBase';

const _routerDictionary = {
    '/personalCenter': '个人中心',
    '/personalCenter/grade': '我的等级',
    '/personalCenter/bounty': '我的奖励金',
    '/personalCenter/myShowHome': '我的晒家',
    '/personalCenter/myShowHome/add': '晒家',
    '/personalCenter/myShowHome/add/selectHouses': '选择楼盘',
    '/personalCenter/myShowHome/add/selectHouses/switchCity': '选择城市',
    '/personalCenter/myShowHome/edit': '晒家',
    '/personalCenter/myShowHome/edit/selectHouses': '选择楼盘',
    '/personalCenter/myShowHome/edit/selectHouses/switchCity': '选择城市',
    '/personalCenter/myBusinessReport': '我的商机报备',
    '/personalCenter/collect': '我的收藏',
    '/personalCenter/suggestionFeedback': '意见反馈',
    '/personalCenter/integral': '积分商城',
    '/personalCenter/integral/integralDetail': '积分明细',
    '/personalCenter/integral/productDetail': '商品详情',
    '/personalCenter/integral/exchangeRecord': '兑换记录',
    '/personalCenter/message': '消息中心',
    '/personalCenter/message/detail': '消息详情',
    '/personalCenter/discountCoupon': '我的优惠券',
    '/personalCenter/discountCoupon/getCoupon': '领券中心',
    '/nearbyShop': '附近门店',
    '/nearbyShop/detail': '附近门店',
    '/onlineCustomService': '在线客服',
    '/myOrder': '我的订单',
    '/myOrder/detail':'订单详情',
    '/myOrder/detail/serve':'订单服务',
    '/myOrder/detail/serve/serveDetail':'服务详情',
    '/myAfterSale': '我的售后',
    '/myAfterSale/detail': '售后详情',
    '/myAfterSale/apply': '申请售后',
    '/myOrder/detail/serve/pingjia':"评价服务",
    '/myOrder/detail/serve/pingjiaResult':'评价结果',
    '/moreCase': '万套案例',
    '/moreCase/palette': '色板详情',
    '/moreCase/mountings': '配件详情',
    '/checkTrue': '产品验真',
    '/showHome': '晒家有礼',
    '/showHome/add': '晒家',
    '/showHome/add/selectHouses': '选择楼盘',
    '/showHome/add/selectHouses/switchCity': '选择城市',
    '/reportBusiness': '报备商机',
   
};

let routerDictionary = {};

if (routerBase === '')
    routerDictionary = _routerDictionary;
else
    Object.keys(_routerDictionary).forEach(item => {
        routerDictionary[routerBase + item] = _routerDictionary[item]
    })


export default routerDictionary