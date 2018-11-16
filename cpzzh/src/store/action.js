import { SELECTION_CASE, USER_INFO, USER_LEVEL_INFO, GLOBAL_LOADING } from './type';
import { isObject } from '../utlis';
import { request } from '../request';
import api from '../request/api';
// _ 为私有action

const _saveSelectionCase = data => ({
    type: SELECTION_CASE,
    data
})

const _saveUserInfo = data => ({
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

const getUserInfo = () => dispatch => {
    request({ url: api.userInfo }).then(res => {
        dispatch(_saveUserInfo(res))
        if (res.isAuth === 1)
            request({ url: api.levelInfo }).then(data => {
                dispatch(_saveUserLevelInfo(data))
            }).catch(err => { })
    }).catch(err => {
        if (isObject(err) && err.msgcode === 710001)
            request.getAuthUrl()
    })
}

const globalLoadingToggle = data => ({
    type: GLOBAL_LOADING,
    data
})

export {
    getSelectionCase,
    getUserInfo,
    globalLoadingToggle
}