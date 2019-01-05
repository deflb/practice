import React, { Component } from 'react';
import wx from 'weixin-js-sdk';
import wxConfig from '../../utlis/wxConfig';
import { mapInstance, convertorTranslate } from '../../utlis/bMap';
import { Route } from 'react-router';
import asyncC from '../../component/asyncC';
import CustomListView from '../../component/customListView';
import { request } from '../../request';
import api from '../../request/api';
import styles from './index.less';
const Detail = asyncC(() => import('./detail'));

export default class nearbyShop extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        flatitude: 0,
        flongitude: 0,
        loading: false,
        refreshing: false,
    }
    goToDetail = rowData => {
        const { history, match } = this.props;
        history.push({
            pathname: match.path + '/detail',
            state: rowData
        })
    }

    getNearShop = ({ pageNo = this.state.pageNo, flatitude = this.state.flatitude, flongitude = this.state.flongitude, dataBlobs = this.state.dataBlobs } = {}) => {
        const { pageSize } = this.state;
        this.setState({ loading: true, flatitude, flongitude });
        request({ url: api.nearShop, data: { distance: 30, flatitude, flongitude, pageNo, pageSize } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            _dataBlobs[0].isNear = 1; // 加入最近标记
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                loading: false,
                refreshing: false,
            });
        }).catch(err => { this.setState({ loading: false, refreshing: false }) })
    }

    getPos = (callback) => {
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                callback(res);
            }
        })
    }

    componentDidMount() {
        wxConfig({ wx, jsApiList: ['getLocation'] }).then(res => {
            let self = this;
            this.getPos((res) => {
                convertorTranslate(res, (bPos) => {
                    mapInstance(bPos, 'map', (point) => {
                        self.getNearShop({ pageNo: 1, flatitude: point.latitude, flongitude: point.longitude, dataBlobs: [] });
                    }, (fn) => {
                        self.getPos((pos) => {
                            convertorTranslate(pos, (bPos) => {
                                fn(bPos);
                            })
                        })
                    });
                });
            })
        }).catch(err => { })
    }

    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getNearShop()
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.getNearShop({ pageNo: 1, dataBlobs: [] })
    }

    render() {
        const { dataBlobs, loading, refreshing } = this.state,
            { match } = this.props;
        return (
            <div className={styles.wrapper}>
                <div id='map'></div>
                <CustomListView
                    className={styles.wrapper_list}
                    sectionBodyClassName={null}
                    loading={loading}
                    data={dataBlobs}
                    onEndReached={this.onEndReached}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    renderRow={(rowData, sectionID, index) => (<ul className={styles.wrapper_list_item} onClick={this.goToDetail.bind(this, rowData)}>
                        <li className={styles.wrapper_list_item_title}><span className={styles.wrapper_list_item_title_pos}>{rowData.fsname}{rowData.isNear === 1 ? <span className={styles.wrapper_list_item_title_pos_tip}>离你最近</span> : null}</span>{rowData.distance.toFixed(1)}km</li>
                        <li className={styles.wrapper_list_item_address}><i className='iconfont icon-address' />{rowData.faddress}</li>
                    </ul>)}
                />
                <Route path={match.path + '/detail'} component={Detail} />
            </div>
        );
    }
}