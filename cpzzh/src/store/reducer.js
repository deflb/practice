import { LOCATION_CHANGE, SELECTION_CASE, USER_INFO, USER_LEVEL_INFO, GLOBAL_LOADING } from './type';
import { isIOS } from '../utlis';

const routeState = (state = '/', action) => { // 路由状态
    if (action.type === LOCATION_CHANGE) {
        let signatureUrl = sessionStorage.getItem('signatureUrl');
        if (!signatureUrl || (signatureUrl && !isIOS()))
            sessionStorage.setItem('signatureUrl', window.location.href)
        return action.payload
    } else
        return state
}

const selectionCase = (state = [], action) => { // 精选方案
    if (action.type === SELECTION_CASE)
        return action.data
    else
        return state
}

const userInfo = (state = {}, action) => { // 当前用户信息
    if (action.type === USER_INFO)
        return action.data
    else
        return state
}

const userLevelInfo = (state = {}, action) => { // 当前用户等级信息
    if (action.type === USER_LEVEL_INFO)
        return action.data
    else
        return state
}

const globalLoading = (state = false, action) => { // 全局loading
    if (action.type === GLOBAL_LOADING)
        return action.data
    else
        return state
}

export default {
    routeState,
    selectionCase,
    userInfo,
    userLevelInfo,
    globalLoading
}