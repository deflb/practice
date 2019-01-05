import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import asyncC from '../../component/asyncC';
import { request } from '../../request';
import { getUserInfo } from '../../store/action';
import { getCookie } from '../../utlis';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
const Page404 = asyncC(() => import('../page404'));
const MyAfterSale = asyncC(() => import('./myAfterSale/start'));
const Apply = asyncC(() => import('./apply'));
const Detail = asyncC(() => import('./myAfterSale/detail'));

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
                    <Route exact path={match.path} component={MyAfterSale} />
                    <Route exact path={match.path + '/apply'} component={Apply} />
                    <Route exact path={match.path + '/detail'} component={Detail} />
                    <Route component={Page404} />
                </Switch>
        );
    }
}))