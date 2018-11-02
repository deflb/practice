import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Router from './router';
import { getUserInfo } from './store/action';
import routerDictionary from './router/routerDictionary';
import { request } from './request';
// import api from './request/api';
import { getCookie } from './utlis';
import './iconfont/iconfont.css';
import './style/index.less';

export default withRouter(connect(state => ({
  routeState: state.routeState
}))(class App extends Component {
  componentDidMount() {
    const uuid = getCookie('uuid');
    if (!uuid) {
      // leibo_wxtest 123456
      request.login({ merchantCode: 'mt', userName: 'leibo_wxtest', password: '123456' }).then(res => {
        this.props.dispatch(getUserInfo())
      }).catch(err => { console.log(err) })
    } else {
      request.setAuthorization(uuid)
      this.props.dispatch(getUserInfo())
    }
    // 针对sf目前的环境 上线配置
    // const { routeState } = this.props,
    //   { search } = routeState,
    //   uuid = search.match(/([?|&])uuid=([^&]*)(&|$)/),
    //   redirectUrl = encodeURIComponent(window.location.href);
    // request.setAuthorization(uuid);
    // this.props.dispatch(getUserInfo());
    // request.post({ url: api.getAuthUrl, data: { redirectUrl } }).then(res => { }).catch(err => { console.log(err) })
  }
  render() {
    const { routeState } = this.props, { pathname } = routeState;
    document.title = routerDictionary[pathname] || '';
    return (
      <Router />
    );
  }
}))