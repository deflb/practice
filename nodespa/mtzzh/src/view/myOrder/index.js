import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import asyncC from '../../component/asyncC';
const Page404 = asyncC(() => import('../page404'));
const reserve = asyncC(() => import('./reserve'));
const detail = asyncC(() => import('./reserve/detail'));
const step = asyncC(() => import('./reserve/schedule'));
const serve = asyncC(() => import('./reserve/orderServe'));
const serveDetail = asyncC(() => import('./reserve/orderServe/detail'));
const pingjia = asyncC(() => import('./reserve/orderServe/pingjia'));
export default class myOrder extends Component {
    render() {
        const { match } = this.props;
        return (
            <div>
                <Switch>
                    <Route exact path={match.path} component={reserve} />
                    <Route exact path={match.path + '/detail'} component={detail} />
                    <Route exact path={match.path + '/detail/step'} component={step} />
                    <Route exact path={match.path + '/detail/serve'} component={serve} />
                    <Route exact path={match.path + '/detail/serve/pingjia'} component={pingjia} />
                    <Route exact path={match.path + '/detail/serve/serveDetail'} component={serveDetail} />
                    <Route component={Page404} />
                </Switch>
            </div>
        );
    }
}