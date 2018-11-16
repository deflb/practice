import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import asyncC from '../../component/asyncC';
const Page404 = asyncC(() => import('../page404'));
const PersonalCenter = asyncC(() => import('./personalCenter'));
const Grade = asyncC(() => import('./grade'));
const Collect = asyncC(() => import('./collect'));
const SuggestionFeedback = asyncC(() => import('./suggestionFeedback'));
const Integral = asyncC(() => import('./integral'));
const Message = asyncC(() => import('./message'));
const DiscountCoupon = asyncC(() => import('./discountCoupon'));

export default class personalCenterIndex extends Component {
    render() {
        const { match } = this.props;
        return (
            <Switch>
                <Route exact path={match.path} component={PersonalCenter} />
                <Route exact path={match.path + '/grade'} component={Grade} />
                <Route path={match.path + '/collect'} component={Collect} />
                <Route exact path={match.path + '/suggestionFeedback'} component={SuggestionFeedback} />
                <Route exact path={match.path + '/integral'} component={Integral} />
                <Route path={match.path + '/message'} component={Message} />
                <Route path={match.path + '/discountCoupon'} component={DiscountCoupon} />
                <Route component={Page404} />
            </Switch>
        );
    }
}