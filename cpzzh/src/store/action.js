import { SELECTION_CASE, USER_INFO, USER_LEVEL_INFO, GLOBAL_LOADING, PAGE_STATUS } from './type';
import { Toast } from 'antd-mobile';
import { isObject, pageUrlRegFn } from '../utlis';
import { request } from '../request';
import api from '../request/api';
import routerBase from '../router/routerBase';
// _ 为私有action

const _saveSelectionCase = data => ({
    type: SELECTION_CASE,
    data
})

const saveUserInfo = data => ({
    type: USER_INFO,
    data
})

const _saveUserLevelInfo = data => ({
    type: USER_LEVEL_INFO,
    data
})

const getSelectionCase = () => dispatch => {
    request({ url: api.pageCase, data: { pageNo: 1, pageSize: 10, sceneId: '' } }).then(res => {
        const list = res.list || [];
        dispatch(_saveSelectionCase(list.slice(0, 2)))
    }).catch(err => { })
}

const getUserInfo = (history, pathname) => dispatch => {
    request({ url: api.userInfo }).then(res => {
        dispatch(saveUserInfo(res));
        if (res.isAuth === 1)
            request({ url: api.levelInfo }).then(data => {
                dispatch(_saveUserLevelInfo(data))
            }).catch(err => { })
        else { // 未验证用户可查看 个人中心 我的收藏 我的晒家 我的商机报备 我的消息 在线客服 意见反馈 晒家有礼 晒家详情 案例 案例详情 附近门店 活动 及以上的下属页面
            if (!pageUrlRegFn('/personalCenter').test(pathname)
                && !pageUrlRegFn('/myCollect').test(pathname)
                && !pageUrlRegFn('/myShowHome').test(pathname)
                && !pageUrlRegFn('/myBusinessReport').test(pathname)
                && !pageUrlRegFn('/myMessage').test(pathname)
                && !pageUrlRegFn('/onlineCustomService').test(pathname)
                && !pageUrlRegFn('/suggestionFeedback').test(pathname)
                && !pageUrlRegFn('/caseDetail').test(pathname)
                && !pageUrlRegFn('/showHomeDetail').test(pathname)
                && !pageUrlRegFn('/showHome').test(pathname)
                && !pageUrlRegFn('/moreCase').test(pathname)
                && !pageUrlRegFn('/nearbyShop').test(pathname)
                && !pageUrlRegFn('/activity').test(pathname)) {
                Toast.fail('请进行验证！', 0.7)
                history.replace(routerBase + '/personalCenter')
            }
        }
    }).catch(err => {
        if (isObject(err) && err.msgcode === 710001)
            request.getAuthUrl()
    })
}

const globalLoadingToggle = data => ({
    type: GLOBAL_LOADING,
    data
})

const setPageStatus = data => ({
    type: PAGE_STATUS,
    data
})

export {
    getSelectionCase,
    getUserInfo,
    saveUserInfo,
    globalLoadingToggle,
    setPageStatus
}