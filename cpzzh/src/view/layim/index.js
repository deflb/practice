import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import asyncC from '../../component/asyncC';
import { request } from '../../request';
import { getUserInfo } from '../../store/action';
import { getCookie } from '../../utlis';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
const Page404 = asyncC(() => import('../page404'));
const layIm = asyncC(() => import('./layIm'));
const reply = asyncC(() => import('./reply'));

export default withRouter(connect(state => ({
    routeState: state.routeState,
    globalLoading: state.globalLoading,
    userInfo: state.userInfo
  }))( class myAfterSale extends Component {
    componentDidMount() {
        request.setDispatch(this.props.dispatch);
        // 针对sf目前的环境 上线配置
        const { routeState, dispatch, history,userInfo={} } = this.props,
          { search } = routeState;
     
        if(!userInfo.customerId){
            const  getUuid = search.match(/([?|&])uuid=([^&]*)(&|$)/),
            uuid = getUuid ? getUuid[2] : getCookie('uuid');
            if (uuid) {
                request.setAuthorization(uuid);
                dispatch(getUserInfo(history, routeState.pathname));
              } else
                request.getAuthUrl()
        }
        
      
      }
    render() {
        const { match } = this.props;
        return (
                <Switch>
                    <Route exact path={match.path} component={layIm} />
                    <Route exact path={match.path + '/reply'} component={reply} />
                    <Route component={Page404} />
                </Switch>
        );
    }
}))