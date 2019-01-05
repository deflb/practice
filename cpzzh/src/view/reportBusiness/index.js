import React from 'react';
import { Switch, Route } from 'react-router';
import asyncC from '../../component/asyncC';
const ReportBusiness = asyncC(() => import('./reportBusiness'));
const Result = asyncC(() => import('./result'));
const Detail = asyncC(() => import('../personalCenter/myBusinessReport/detail'));
const Page404 = asyncC(() => import('../page404'));

export default ({ match }) => <Switch>
    <Route exact path={match.path} component={ReportBusiness} />
    <Route exact path={match.path + '/result'} component={Result} />
    <Route exact path={match.path + '/detail'} component={Detail} />
    <Route component={Page404} />
</Switch>
