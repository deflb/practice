import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import asyncC from '../../component/asyncC';
const Page404 = asyncC(() => import('../page404'));
const PersonalCenter = asyncC(() => import('./personalCenter'));
// const Grade = asyncC(() => import('./grade'));
// const Bounty = asyncC(() => import('./bounty'));
// const MyShowHome = asyncC(() => import('./myShowHome'));
// const MyBusinessReport = asyncC(() => import('./myBusinessReport'));
// const Collect = asyncC(() => import('./collect'));
// const SuggestionFeedback = asyncC(() => import('./suggestionFeedback'));
// const Integral = asyncC(() => import('./integral'));
// const Message = asyncC(() => import('./message'));
// const DiscountCoupon = asyncC(() => import('./discountCoupon'));
// const layim = asyncC(() => import('../layim'))
export default class personalCenterIndex extends Component {
    render() {
        const { match } = this.props;
        return (<Switch>
            <Route exact path={match.path} component={PersonalCenter} />
            {/* <Route exact path={match.path + '/grade'} component={Grade} /> */}
            {/* <Route exact path={match.path + '/bounty'} component={Bounty} /> */}
            {/* <Route path={match.path + '/myShowHome'} component={MyShowHome} /> */}
            {/* <Route path={match.path + '/myBusinessReport'} component={MyBusinessReport} /> */}
            {/* <Route path={match.path + '/collect'} component={Collect} /> */}
            {/* <Route exact path={match.path + '/suggestionFeedback'} component={SuggestionFeedback} /> */}
            {/* <Route path={match.path + '/integral'} component={Integral} /> */}
            {/* <Route path={match.path + '/message'} component={Message} /> */}
            {/* <Route path={match.path + '/discountCoupon'} component={DiscountCoupon} /> */}
            {/* <Route path={match.path + '/onlineCustomService'} component={layim} /> */}
            <Route component={Page404} />
        </Switch>);
    }
}