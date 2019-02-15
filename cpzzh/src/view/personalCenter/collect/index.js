import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd-mobile';
import CaseCollect from './caseCollect';
import ShowhomeCollect from './showhomeCollect';

export default connect(state => ({
    routeState: state.routeState,
    pageStatus: state.pageStatus
}))(class index extends Component {
    state = {
        page: 'case',
    }

    getMatchsKey = (pathname) => {
        const matchs = pathname.match(/collect\/([^/]*)/);
        return matchs ? matchs[1] : '';
    }

    componentWillReceiveProps(nextProps) {
        const { pathname } = nextProps.routeState;
        if (pathname !== this.props.routeState.pathname) {
            const key = this.getMatchsKey(pathname), formatKey = key ? key.split('Detail')[0] : '';
            if (formatKey && formatKey !== this.state.page) this.setState({ page: formatKey })
        }
    }

    componentDidMount() {
        console.log(this.props.pageStatus)
    }

    keepAlive = (state) => {
        console.log(state)
        const { pageStatus, match } = this.props;
        if(pageStatus[match.path]){

        }
        pageStatus[match.path] = state;
        this.props.dispatch({
            type: 'PAGE_STATUS',
            data: pageStatus
        })
    }

    render() {
        const { page } = this.state, { match, history } = this.props;
        return <Tabs
            prerenderingSiblingsNumber={0}
            swipeable={false}
            tabs={[
                { key: 'case', title: '案例' },
                { key: 'showHome', title: '晒家' },
            ]}
            page={page}
            onChange={({ ...props }) => { this.setState({ page: props.key }) }}
        >
            <CaseCollect key='case' match={match} history={history} keepAlive={this.keepAlive} />
            <ShowhomeCollect key='showHome' match={match} history={history} keepAlive={this.keepAlive} />
        </Tabs>
    }
})