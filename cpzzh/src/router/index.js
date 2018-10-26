import React from 'react';
import { Switch, Route } from 'react-router';
import asyncC from '../component/asyncC';
const Page404 = asyncC(() => import('../view/page404'));
const PersonalCenter = asyncC(() => import('../view/personalCenter')); // 个人中心
const NearbyShop = asyncC(() => import('../view/nearbyShop')); // 附近门店
const OnlineCustomService = asyncC(() => import('../view/onlineCustomService')); // 在线客服
const MyOrder = asyncC(() => import('../view/myOrder')); // 我的订单
const MyAfterSale = asyncC(() => import('../view/myAfterSale')); // 我的售后
const MoreCase = asyncC(() => import('../view/moreCase')); // 万套案例

export default () => <Switch>
    <Route path='/personalCenter' component={PersonalCenter} />
    <Route path='/nearbyShop' component={NearbyShop} />
    <Route path='/onlineCustomService' component={OnlineCustomService} />
    <Route path='/myOrder' component={MyOrder} />
    <Route path='/myAfterSale' component={MyAfterSale} />
    <Route path='/moreCase' component={MoreCase} />
    <Route component={Page404} />
</Switch>