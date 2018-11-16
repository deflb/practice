import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Router from './router';
import { ActivityIndicator } from 'antd-mobile';
import { getUserInfo } from './store/action';
import routerDictionary from './router/routerDictionary';
import { request } from './request';
// import api from './request/api';
import { getCookie } from './utlis';
import './iconfont/iconfont.css';
import './style/index.less';
import styles from './App.less';

export default withRouter(connect(state => ({
  routeState: state.routeState,
  globalLoading: state.globalLoading
}))(class App extends Component {
  componentDidMount() {
    // const uuid = getCookie('uuid');
    // if (!uuid) {
    //   // leibo_wxtest 123456
    //   request.login({ merchantCode: 'mt', userName: 'leibo_wxtest', password: '123456' }).then(res => {
    //     this.props.dispatch(getUserInfo())
    //   }).catch(err => { console.log(err) })
    // } else {
    //   request.setAuthorization(uuid)
    //   this.props.dispatch(getUserInfo())
    // }
    // 针对sf目前的环境 上线配置
    const { routeState } = this.props,
      { search } = routeState,
      getUuid = search.match(/([?|&])uuid=([^&]*)(&|$)/),
      uuid = getUuid ? getUuid[2] : getCookie('uuid');
    if (uuid) {
      request.setAuthorization(uuid);
      this.props.dispatch(getUserInfo());
    } else
      // window.location.href = 'http://192.168.5.12:9999'+ api.getAuthUrl + `?redirectUrl=${encodeURIComponent(window.location.href)}`;
      request.getAuthUrl()
    // 测试提示
    console.log('页面模块url：\n个人中心 /wx/personalCenter\n附近门店 /wx/nearbyShop\n万套案例 /wx/moreCase\n我的订单及售后入口在个人中心')
  }
  render() {
    const { routeState, globalLoading } = this.props, { pathname } = routeState;
    document.title = routerDictionary[pathname] || '';
    return (
      <div className={styles.wrapper}>
        <Router />
        <ActivityIndicator toast={globalLoading} className={styles.wrapper_loading} />
      </div>
    );
  }
}))