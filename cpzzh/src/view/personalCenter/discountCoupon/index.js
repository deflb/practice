import React, { Component } from 'react';
import { Route } from 'react-router';
import { ListView } from 'antd-mobile';
import { connect } from 'react-redux';
import { globalLoadingToggle } from '../../../store/action';
import Coupon from './coupon';
import asyncC from '../../../component/asyncC';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './index.less';
const GetCoupon = asyncC(() => import('./getCoupon'));

export default connect()(class discountCoupon extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
        isLoading: false,
    }

    getList = ({
        pageNo = this.state.pageNo,
    } = {}) => {
        this.props.dispatch(globalLoadingToggle(true))
        const { pageSize, dataSource, dataBlobs } = this.state;
        request({ url: api.myCoupon, data: { pageNo, pageSize } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.props.dispatch(globalLoadingToggle(false))
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                dataSource: dataSource.cloneWithRows([..._dataBlobs]),
                isLoading: false,
            })
        }).catch(err => { this.setState({ isLoading: false }) })
    }
    componentDidMount() {
        this.getList()
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getList()
    }

    goToGetCoupon = () => {
        const { match, history } = this.props;
        history.push(match.path + '/getCoupon')
    }

    render() {
        const { dataSource, dataBlobs, isLoading } = this.state,
            { match } = this.props;
        return (
            <ul className={styles.wrapper}>
                <li className='bg_grey_list_view'>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={dataSource}
                        renderFooter={() => isLoading ? '加载中...' : dataBlobs.length ? '我是有底线的' : '暂无结果'}
                        renderRow={(rowData, sectionID, index) => <Coupon rowData={rowData} />}
                        onEndReached={this.onEndReached}
                    // onEndReachedThreshold={80}
                    />
                </li>
                <li className={styles.wrapper_bottom} onClick={this.goToGetCoupon}>
                    去领券>>
                </li>
                <Route path={match.path + '/getCoupon'} component={GetCoupon} />
            </ul>
        );
    }
})