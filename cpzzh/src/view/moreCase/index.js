import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd-mobile';
import Case from './case';
import Mountings from './mountings';
import Palette from './palette';

export default connect(state => ({
    routeState: state.routeState
}))(class index extends Component {

    state = {
        page: 'case',
    }

    componentWillMount() {
        const { routeState } = this.props,
            { pathname } = routeState,
            key = pathname.split('/')[2];
        if (key)
            this.setState({ page: key })
    }

    render() {
        const { page } = this.state, { history, match } = this.props;
        return <Tabs
            tabs={[
                { key: 'case', title: '设计案例' },
                { key: 'palette', title: '色板库' },
                { key: 'mountings', title: '配件库' },
            ]}
            tabBarTextStyle={{ color: '#AEAEAE' }}
            tabBarActiveTextColor='#DA4943'
            tabBarUnderlineStyle={{ borderColor: '#FF0000' }}
            prerenderingSiblingsNumber={0}
            page={page}
            onChange={({ ...props }) => { this.setState({ page: props.key }) }}
        >
            <Case key='case' history={history} match={match} />
            <Palette key='palette' history={history} match={match} />
            <Mountings key='mountings' history={history} match={match} />
        </Tabs>
    }
})