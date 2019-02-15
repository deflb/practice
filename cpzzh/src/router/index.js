import React from 'react';
import { Switch, Route } from 'react-router';
import routerBase from './routerBase';
import asyncC from '../component/asyncC';
const Page404 = asyncC(() => import('../view/page404'));
const PersonalCenter = asyncC(() => import('../view/personalCenter')); // 个人中心
const MyCollect = asyncC(() => import('../view/personalCenter/collect')); // 我的收藏
const MyShowHome = asyncC(() => import('../view/personalCenter/myShowHome')); // 我的晒家
const MyBusinessReport = asyncC(() => import('../view/personalCenter/myBusinessReport')); // 我的商机报备
const MyMessage = asyncC(() => import('../view/personalCenter/message')); // 我的消息
const SuggestionFeedback = asyncC(() => import('../view/personalCenter/suggestionFeedback')); // 意见反馈
const Grade = asyncC(() => import('../view/personalCenter/grade')); // 成长值
const Bounty = asyncC(() => import('../view/personalCenter/bounty')); // 奖励金
const DiscountCoupon = asyncC(() => import('../view/personalCenter/discountCoupon')); // 优惠券
const Integral = asyncC(() => import('../view/personalCenter/integral')); // 积分
const NearbyShop = asyncC(() => import('../view/nearbyShop')); // 附近门店
const CustomServiceCenter = asyncC(() => import('../view/onlineCustomService')); // 客服中心
const OnlineCustomService = asyncC(() => import('../view/layim')); // 在线客服
const MyOrder = asyncC(() => import('../view/myOrder')); // 我的订单
const MyAfterSale = asyncC(() => import('../view/myAfterSale')); // 我的售后
const MoreCase = asyncC(() => import('../view/moreCase')); // 万套案例
const CaseDetail = asyncC(() => import('../view/moreCase/caseComponent/detail')); // 案例详情
const CheckTrue = asyncC(() => import('../view/checkTrue')); // 产品验证
const ShowHome = asyncC(() => import('../view/showHome')); // 晒家有礼
const ShowHomeDetail = asyncC(() => import('../view/showHome/detail')); // 晒家详情
const ShowHomeAddOrEdit = asyncC(() => import('../view/showHome/addOrEdit')); // 晒家新增|修改
const Activity = asyncC(() => import('../view/activity')); // 活动
const ReportBusiness = asyncC(() => import('../view/reportBusiness')); // 报备商机

export default () => <Switch>
    <Route path={routerBase + '/personalCenter'} component={PersonalCenter} />
    <Route path={routerBase + '/myCollect'} component={MyCollect} />
    <Route path={routerBase + '/myShowHome'} component={MyShowHome} />
    <Route path={routerBase + '/myBusinessReport'} component={MyBusinessReport} />
    <Route path={routerBase + '/myMessage'} component={MyMessage} />
    <Route path={routerBase + '/suggestionFeedback'} component={SuggestionFeedback} />
    <Route path={routerBase + '/nearbyShop'} component={NearbyShop} />
    <Route path={routerBase + '/customServiceCenter'} component={CustomServiceCenter} />
    <Route path={routerBase + '/onlineCustomService'} component={OnlineCustomService} />
    <Route path={routerBase + '/grade'} component={Grade} />
    <Route path={routerBase + '/bounty'} component={Bounty} />
    <Route path={routerBase + '/discountCoupon'} component={DiscountCoupon} />
    <Route path={routerBase + '/integral'} component={Integral} />
    <Route path={routerBase + '/myOrder'} component={MyOrder} />
    <Route path={routerBase + '/myAfterSale'} component={MyAfterSale} />
    <Route path={routerBase + '/moreCase'} component={MoreCase} />
    <Route path={routerBase + '/caseDetail'} component={CaseDetail} />
    <Route path={routerBase + '/checkTrue'} component={CheckTrue} />
    <Route path={routerBase + '/showHome'} component={ShowHome} />
    <Route path={routerBase + '/showHomeDetail'} component={ShowHomeDetail} />
    <Route path={routerBase + '/addShowHome'} component={ShowHomeAddOrEdit} />
    <Route path={routerBase + '/editShowHome'} component={ShowHomeAddOrEdit} />
    <Route path={routerBase + '/activity'} component={Activity} />
    <Route path={routerBase + '/reportBusiness'} component={ReportBusiness} />
    <Route component={Page404} />
</Switch>