import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import routerBase from './router/routerBase';
import asyncC from './component/asyncC';
import App from './App';
const Page404 = asyncC(() => import('./view/page404'));

export default class root extends Component {
    render() {
        return <Switch>
            <Route path={routerBase + '/'} component={App} />
            <Route component={Page404} />
        </Switch>
    }
}