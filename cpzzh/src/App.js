import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Router from './router';
import { ActivityIndicator } from 'antd-mobile';
import { getUserInfo } from './store/action';
import routerDictionary from './router/routerDictionary';
import { request } from './request';
import { getCookie, isIOS, getLocationSearch } from './utlis';
import './iconfont/iconfont.css';
import './style/index.less';
import 'draft-js/dist/Draft.css';
import styles from './App.less';

export default withRouter(connect(state => ({
  routeState: state.routeState,
  globalLoading: state.globalLoading,
}))(class App extends Component {
  componentDidMount() {
    if (isIOS) { // 处理ios微信 软键盘收起页面不回弹bug
      this.handleFocusin = () => { if (this.timer) { clearTimeout(this.timer); this.timer = null; } };
      this.handleFocusout = () => { this.timer = setTimeout(() => { window.scrollTo(0, window.scrollY) }, 20) };
      document.body.addEventListener('focusin', this.handleFocusin);
      document.body.addEventListener('focusout', this.handleFocusout);
    }
    request.setDispatch(this.props.dispatch);
    // 针对sf环境 调起授权以及给封装的请求方法注入自定义请求头信息(Authorization)
    const { routeState, dispatch, history } = this.props,
      { pathname } = routeState,
      searchUuid = getLocationSearch('uuid'),
      uuid = searchUuid ? searchUuid : getCookie('uuid');
    if (uuid) {
      request.setAuthorization(uuid);
      dispatch(getUserInfo(history, pathname));
    } else if (getLocationSearch('errorMsg')) {
      throw Error()
    } else
      request.getAuthUrl()
  }
  componentWillUnmount() {
    sessionStorage.removeItem('signatureUrl');
    if (isIOS) {
      document.body.removeEventListener('focusin', this.handleFocusin)
      document.body.removeEventListener('focusout', this.handleFocusout)
    }
  }
  render() {
    const { routeState, globalLoading } = this.props, { pathname } = routeState;
    if (routerDictionary[pathname])
      document.title = routerDictionary[pathname];
    return (<React.Fragment>
      <Router />
      <ActivityIndicator toast={globalLoading} className={styles.loading} />
    </React.Fragment>);
  }
}))