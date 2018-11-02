import { SELECTION_CASE, USER_INFO } from './type';
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

const getSelectionCase = () => dispatch => {
    request({ url: api.pageCase, data: { pageNo: 1, pageSize: 10, sceneId: '' } }).then(res => {
        const list = res.list || [];
        dispatch(_saveSelectionCase(list.slice(0, 2)))
    }).catch(err => { })
}

const getUserInfo = () => dispatch => {
    request({ url: api.userInfo }).then(res => {
        dispatch(_saveUserInfo(res))
    }).catch(err => { })
}

export {
    getSelectionCase,
    getUserInfo
}