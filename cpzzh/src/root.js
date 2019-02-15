import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import routerBase from './router/routerBase';
import asyncC from './component/asyncC';
import App from './App';
const Page404 = asyncC(() => import('./view/page404'));

export default class root extends Component {
    state = {
        hasError: false
    }
    componentDidCatch() {
        this.setState({ hasError: true })
    }
    render() {
        const { hasError } = this.state;
        return hasError ? <div>页面崩溃，我们的技术人员正在修复中...</div> : <Switch>
            <Route path={routerBase + '/'} component={App} />
            <Route component={Page404} />
        </Switch>
    }
}