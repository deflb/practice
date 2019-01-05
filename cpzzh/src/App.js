import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Router from './router';
import { ActivityIndicator } from 'antd-mobile';
import { getUserInfo } from './store/action';
import routerDictionary from './router/routerDictionary';
import { request } from './request';
import { getCookie } from './utlis';
import './iconfont/iconfont.css';
import './style/index.less';
import styles from './App.less';

export default withRouter(connect(state => ({
  routeState: state.routeState,
  globalLoading: state.globalLoading,
}))(class App extends Component {
  componentDidMount() {
    request.setDispatch(this.props.dispatch);
    // 针对sf环境 调起授权以及给封装的请求方法注入自定义请求头信息(Authorization)
    const { routeState, dispatch, history } = this.props,
      { search, pathname } = routeState,
      getUuid = search.match(/(\?|&)uuid=([^&]*)/),
      uuid = getUuid ? getUuid[2] : getCookie('uuid');
    if (uuid) {
      request.setAuthorization(uuid);
      dispatch(getUserInfo(history, pathname));
    } else
      request.getAuthUrl()
  }
  componentWillUnmount() {
    sessionStorage.removeItem('signatureUrl');
  }
  render() {
    const { routeState, globalLoading } = this.props, { pathname } = routeState;
    if (routerDictionary[pathname])
      document.title = routerDictionary[pathname];
    return (
      <div className={styles.wrapper}>
        <Router />
        <ActivityIndicator toast={globalLoading} className={styles.wrapper_loading} />
      </div>
    );
  }
}))