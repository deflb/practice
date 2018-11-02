import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import asyncC from '../../component/asyncC';
const Page404 = asyncC(() => import('../page404'));
const MyAfterSale = asyncC(() => import('./myAfterSale/start'));
const Apply = asyncC(() => import('./apply'));
const Detail = asyncC(() => import('./myAfterSale/detail'));

export default class myAfterSaleIndex extends Component {
    render() {
        const { match } = this.props;
        return (
            <div>
                <Switch>
                    <Route exact path={match.path} component={MyAfterSale} />
                    <Route exact path={match.path + '/apply'} component={Apply} />
                    <Route exact path={match.path + '/detail'} component={Detail} />
                    <Route component={Page404} />
                </Switch>
            </div>
        );
    }
}