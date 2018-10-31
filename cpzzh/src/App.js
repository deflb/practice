import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Router from './router';
import { getUserInfo } from './store/action';
import routerDictionary from './router/routerDictionary';
import { request } from './request';
import { getCookie } from './utlis';
// import wx from 'weixin-js-sdk';
import './iconfont/iconfont.css';
import './style/index.less';

export default withRouter(connect(state => ({
  routeState: state.routeState
}))(class App extends Component {
  componentDidMount() {
    const uuid = getCookie('uuid');
    if (!uuid) {
      // leibo_wxtest 123456
      request.login({ merchantCode: 'mt', userName: 'admin', password: 'a123456' }).then(res => {
        this.props.dispatch(getUserInfo())
      }).catch(err => { console.log(err) })
    } else {
      request.setAuthorization(uuid)
      this.props.dispatch(getUserInfo())
    }
  }
  render() {
    const { routeState } = this.props, { pathname } = routeState;
    document.title = routerDictionary[pathname] || '';
    return (
      <Router />
    );
  }
}))