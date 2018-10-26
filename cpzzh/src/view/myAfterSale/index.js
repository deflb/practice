import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import asyncC from '../../component/asyncC';
const Page404 = asyncC(() => import('../page404'));
const MyAfterSale = asyncC(() => import('./myAfterSale'));
const Apply = asyncC(() => import('./apply'));

export default class myAfterSaleIndex extends Component {
    render() {
        const { match } = this.props;
        return (
            <div>
                <Switch>
                    <Route exact path={match.path} component={MyAfterSale} />
                    <Route exact path={match.path + '/apply'} component={Apply} />
                    <Route component={Page404} />
                </Switch>
            </div>
        );
    }
}