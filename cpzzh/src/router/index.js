import React from 'react';
import { Switch, Route } from 'react-router';
import routerBase from './routerBase';
import asyncC from '../component/asyncC';
const Page404 = asyncC(() => import('../view/page404'));
const PersonalCenter = asyncC(() => import('../view/personalCenter')); // 个人中心
const NearbyShop = asyncC(() => import('../view/nearbyShop')); // 附近门店
const OnlineCustomService = asyncC(() => import('../view/onlineCustomService')); // 在线客服
const MyOrder = asyncC(() => import('../view/myOrder')); // 我的订单
const MyAfterSale = asyncC(() => import('../view/myAfterSale')); // 我的售后
const MoreCase = asyncC(() => import('../view/moreCase')); // 万套案例
const CheckTrue = asyncC(() => import('../view/checkTrue')); // 产品验证
const ShowHome = asyncC(() => import('../view/showHome')); // 晒家有礼
const Activity = asyncC(() => import('../view/activity')); // 活动
const ReportBusiness = asyncC(() => import('../view/reportBusiness')); // 报备商机

export default () => <Switch>
    <Route path={routerBase + '/personalCenter'} component={PersonalCenter} />
    <Route path={routerBase + '/nearbyShop'} component={NearbyShop} />
    <Route path={routerBase + '/onlineCustomService'} component={OnlineCustomService} />
    <Route path={routerBase + '/myOrder'} component={MyOrder} />
    <Route path={routerBase + '/myAfterSale'} component={MyAfterSale} />
    <Route path={routerBase + '/moreCase'} component={MoreCase} />
    <Route path={routerBase + '/checkTrue'} component={CheckTrue} />
    <Route path={routerBase + '/showHome'} component={ShowHome} />
    <Route path={routerBase + '/activity'} component={Activity} />
    <Route path={routerBase + '/reportBusiness'} component={ReportBusiness} />
    <Route component={Page404} />
</Switch>