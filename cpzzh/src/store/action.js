import { SELECTION_CASE } from './type';
import { request } from '../request';
import api from '../request/api';
// _ 为私有action

const _saveSelectionCase = data => ({
    type: SELECTION_CASE,
    data
})

const getSelectionCase = () => dispatch => {
    request({ url: api.pageCase, data: { pageNo: 1, pageSize: 10, sceneId: '' } }).then(res => {
        const list = res.list || [];
        dispatch(_saveSelectionCase(list.slice(0, 2)))
    }).catch(err => { })
}

export {
    getSelectionCase
}