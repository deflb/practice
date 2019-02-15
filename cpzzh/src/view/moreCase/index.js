import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd-mobile';
import Case from './case';
import Mountings from './mountings';
import Palette from './palette';
import { isIOS } from '../../utlis';

export default connect(state => ({
    routeState: state.routeState
}))(class index extends Component {

    state = {
        page: 'case',
    }

    getMatchsKey = (pathname) => {
        const matchs = pathname.match(/moreCase\/([^/]*)/);
        return matchs ? matchs[1] : '';
    }
    componentWillMount() {
        const key = this.getMatchsKey(this.props.routeState.pathname);
        if (key && key !== this.state.page) this.setState({ page: key })
    }

    render() {
        const { page } = this.state, { history, match } = this.props;
        return <Tabs
            swipeable={false}
            destroyInactiveTab={isIOS() ? true : false}
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