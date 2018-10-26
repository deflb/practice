import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import { ListView } from 'antd-mobile';
import asyncC from '../../component/asyncC';
import NoResult from '../../component/noResult';
import { request } from '../../request';
import api from '../../request/api';
import styles from './index.less';
const Detail = asyncC(() => import('./detail'));

export default class nearbyShop extends Component { // 此页调用 wx js-sdk 获取用户位置 地图展示用 百度地图jsApi
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
        isLoading: false,
        height: 0,
    }
    goToDetail = rowData => {
        const { history, match } = this.props;
        history.push({
            pathname: match.path + '/detail',
            state: rowData
        })
    }

    getNearShop = () => {
        const { pageNo, pageSize, dataBlobs, dataSource } = this.state;
        request({ url: api.nearShop, data: { distance: 5, flatitude: 23.132456, flongitude: 113.378585, pageNo, pageSize } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn;
            list.sort((a, b) => a.distance - b.distance)
            list[0].isNear = 1; // 加入最近标记
            const _dataBlobs = [...dataBlobs, ...list];
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
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).getBoundingClientRect().top;
        this.setState({ height: hei })
        this.getNearShop()
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getNearShop()
    }

    render() {
        const { dataBlobs, dataSource, height } = this.state,
            { match } = this.props;
        return (
            <div className={styles.wrapper}>
                <div id='map'></div>
                <ListView
                    className={`${styles.wrapper_list} list_view_maybe_comon`}
                    ref={el => this.lv = el}
                    dataSource={dataSource}
                    renderHeader={() => dataBlobs.length ? null : <NoResult />}
                    renderRow={(rowData, sectionID, index) => <ul className={styles.wrapper_list_item} onClick={this.goToDetail.bind(this, rowData)}>
                        <li className={styles.wrapper_list_item_title}><span className={styles.wrapper_list_item_title_pos}>{rowData.fsname}{rowData.isNear === 1 ? <span className={styles.wrapper_list_item_title_pos_tip}>离你最近</span> : null}</span>{rowData.distance.toFixed(1)}km</li>
                        <li className={styles.wrapper_list_item_address}><i className='iconfont icon-address' />{rowData.faddress}</li>
                    </ul>}
                    style={{
                        height
                    }}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={30}
                />
                <Route path={match.path + '/detail'} component={Detail} />
            </div>
        );
    }
}