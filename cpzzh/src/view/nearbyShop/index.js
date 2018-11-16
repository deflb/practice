import React, { Component } from 'react';
import wx from 'weixin-js-sdk';
import wxConfig from '../../utlis/wxConfig';
// import BMap from 'BMap';
import { Route } from 'react-router';
import { ListView } from 'antd-mobile';
import asyncC from '../../component/asyncC';
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
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
        isLoading: false,
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
        this.getNearShop();

        wxConfig({ wx, jsApiList: ['getLocation'] }).then(res => { // 地图展示用 百度地图jsApi
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    alert(res)
                    // var ggPoint = new BMap.Point(res.longitude, res.latitude);
                    // //地图初始化
                    // var bm = new BMap.Map("map");
                    // bm.centerAndZoom(ggPoint, 18);
                    // bm.addControl(new BMap.NavigationControl());
                    // bm.addControl(new BMap.OverviewMapControl());
                    // bm.addControl(new BMap.ScaleControl());
                    // bm.addControl(new BMap.MapTypeControl());
                    // bm.addControl(new BMap.CopyrightControl());
                    // bm.addControl(new BMap.GeolocationControl());

                    // var convertor = new BMap.Convertor();
                    // var pointArr = [];
                    // pointArr.push(ggPoint);
                    // convertor.translate(pointArr, 1, 5, (data) => {
                    //     if (data.status === 0) {
                    //         const pos = data.points[0];
                    //         var marker = new BMap.Marker(pos);
                    //         bm.addOverlay(marker);
                    //         // var label = new BMap.Label("当前位置", { offset: new BMap.Size(20, -10) });
                    //         // marker.setLabel(label); //添加百度label
                    //         bm.setCenter(pos);

                    //         var myGeo = new BMap.Geocoder();
                    //         // 根据坐标得到地址描述
                    //         myGeo.getLocation(new BMap.Point(pos.lng, pos.lat), function (result) {
                    //             if (result) {
                    //                 console.log(result)
                    //             }
                    //         });
                    //     }
                    // })
                }
            });
        }).catch(err => { console.log(err) })
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getNearShop()
    }

    render() {
        const { dataBlobs, dataSource, isLoading } = this.state,
            { match } = this.props;
        return (
            <div className={styles.wrapper}>
                <div id='map'></div>
                <ListView
                    className={styles.wrapper_list}
                    ref={el => this.lv = el}
                    dataSource={dataSource}
                    renderFooter={() => isLoading ? '加载中...' : dataBlobs.length ? '我是有底线的' : '暂无结果'}
                    renderRow={(rowData, sectionID, index) => <ul className={styles.wrapper_list_item} onClick={this.goToDetail.bind(this, rowData)}>
                        <li className={styles.wrapper_list_item_title}><span className={styles.wrapper_list_item_title_pos}>{rowData.fsname}{rowData.isNear === 1 ? <span className={styles.wrapper_list_item_title_pos_tip}>离你最近</span> : null}</span>{rowData.distance.toFixed(1)}km</li>
                        <li className={styles.wrapper_list_item_address}><i className='iconfont icon-address' />{rowData.faddress}</li>
                    </ul>}
                    onEndReached={this.onEndReached}
                // onEndReachedThreshold={30}
                />
                <Route path={match.path + '/detail'} component={Detail} />
            </div>
        );
    }
}