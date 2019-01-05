import React from 'react';
import { Tabs } from 'antd-mobile';
import CaseCollect from './caseCollect';
import ShowhomeCollect from './showhomeCollect';

export default ({ ...props }) => {
    let { match, history } = props;
    return <Tabs
        prerenderingSiblingsNumber={0}
        swipeable={false}
        tabs={[
            { key: 'case', title: '案例' },
            { key: 'showHome', title: '晒家' },
        ]}
    >
        <CaseCollect key='case' match={match} history={history} />
        <ShowhomeCollect key='showHome' match={match} history={history} />
    </Tabs>
}