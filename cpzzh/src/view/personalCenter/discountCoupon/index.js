import React, { Component } from 'react';
// import { Route } from 'react-router';
import Coupon from './coupon';
// import asyncC from '../../../component/asyncC';
import CustomListView from '../../../component/customListView';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './index.less';
// const GetCoupon = asyncC(() => import('./getCoupon'));

export default class discountCoupon extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
        refreshing: false,
    }

    getList = ({
        pageNo = this.state.pageNo,
        dataBlobs = this.state.dataBlobs,
    } = {}) => {
        const { pageSize } = this.state;
        this.setState({ loading: true });
        request({ url: api.myCoupon, data: { pageNo, pageSize } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                loading: false,
                refreshing: false
            })
        }).catch(err => { this.setState({ loading: false, refreshing: false }) })
    }
    componentDidMount() {
        this.getList()
    }

    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getList()
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.getList({ pageNo: 1, dataBlobs: [] })
    }

    goToGetCoupon = () => {
        const { match, history } = this.props;
        history.push(match.path + '/getCoupon')
    }

    render() {
        const { dataBlobs, loading, refreshing } = this.state;
        // { match } = this.props;
        return (
            <div className={styles.wrapper}>
                <CustomListView
                    style={{ flex: 1 }}
                    sectionBodyClassName={styles.wrapper_main}
                    loading={loading}
                    data={dataBlobs}
                    onEndReached={this.onEndReached}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    renderRow={(rowData, sectionID, index) => (<Coupon key={rowData.id} rowData={rowData} />)}
                />
                {/* <div className={styles.wrapper_bottom} onClick={this.goToGetCoupon}>
                    去领券>>
                </div>
                <Route path={match.path + '/getCoupon'} component={GetCoupon} /> */}
            </div>
        );
    }
}