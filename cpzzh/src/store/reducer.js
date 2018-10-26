import { LOCATION_CHANGE, SELECTION_CASE } from './type';

const routeState = (state = '/', action) => { // 路由状态
    if (action.type === LOCATION_CHANGE)
        return action.payload
    else
        return state
}

const selectionCase = (state = [], action) => { // 精选方案
    if (action.type === SELECTION_CASE)
        return action.data
    else
        return state
}

export default {
    routeState,
    selectionCase
}