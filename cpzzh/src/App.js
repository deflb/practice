import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Router from './router';
import routerDictionary from './router/routerDictionary';
import { request } from './request';
import { getCookie } from './utlis';
import './iconfont/iconfont.css';
import './style/index.less';

export default withRouter(connect(state => ({
  routeState: state.routeState
}))(class App extends Component {
  componentDidMount() {
    const uuid = getCookie('uuid');
    if (!uuid) {
      request.login({ merchantCode: 'mt', userName: 'admin', password: 'a123456' }).then(res => {
        console.log(res)
      }).catch(err => { console.log(err) })
    } else
      request.setAuthorization(uuid)
  }
  render() {
    const { routeState } = this.props, { pathname } = routeState;
    document.title = routerDictionary[pathname] || '';
    return (
      <Router />
    );
  }
}))