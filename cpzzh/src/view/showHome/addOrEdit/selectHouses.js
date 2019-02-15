import React, { Component } from 'react';
import { Route } from 'react-router';
import hasPositionFullScreen from '../../../component/fullScreen/hasPositionFullScreen';
import CustomSearchBar from '../../../component/customSearchBar';
import IndexedList from '../../../component/indexedList';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import asyncC from '../../../component/asyncC';
import { request } from '../../../request';
import api from '../../../request/api';
import wx from 'weixin-js-sdk';
import wxConfig from '../../../utlis/wxConfig';
import { coordConvertor, geocoder } from '../../../utlis/bMap';
import { sortAndClassify } from '../../../utlis/hzToPy';
import styles from './selectHouses.less';
const SwitchCity = asyncC(() => import('./switchCity'));

export default hasPositionFullScreen(class selectHouses extends Component {
    state = {
        cityName: '',
        // 查询
        cityId: '',
        keyword: '',

        houses: [],
        housesLen: 0,
    }
    getPos = () => {
        let self = this;
        this.setState({ cityName: '定位中...' })
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                coordConvertor([res], 1, 5).then(res => {
                    const { lng, lat } = res[0];
                    geocoder({ longitude: lng, latitude: lat }, (addressComponents) => {
                        let cityName = addressComponents.city;
                        self.setState({ cityName });
                        request({ url: api.getCityByName, data: { cityName } }).then(info => {
                            self.getHouse({ cityId: info.id })
                        })
                    });
                })
            }
        })
    }
    getHouse = ({ cityId = this.state.cityId, keyword = this.state.keyword } = {}) => {
        const param = {};
        if (cityId !== this.state.cityId) this.setState({ cityId });
        if (keyword !== this.state.keyword) this.setState({ keyword });
        if (cityId) param.cityId = cityId;
        if (keyword) param.buildingName = keyword;
        request({ url: api.getBuildingList, data: param }).then(res => {
            const data = res || [], length = data.length,
                _data = sortAndClassify(data, 'name');
            this.setState({ housesLen: length, houses: _data })
        })
    }
    componentDidMount() {
        wxConfig({ wx, jsApiList: ['getLocation'] }).then(() => {
            this.getPos()
        })
    }

    onSearch = keyword => {
        if (keyword !== this.state.keyword) {
            this.getHouse({ keyword })
        }
    }

    whichCity = data => {
        const { id, name } = data;
        this.getHouse({ cityId: id });
        this.setState({ cityName: name });
    }

    render() {
        const { cityName, houses, housesLen } = this.state,
            { match, history, whichHouses } = this.props;
        return (<div className={styles.wrapper}>
            <CustomSearchBar
                style={{ padding: '0 15px' }}
                onSearch={this.onSearch}
                placeholder='输入楼盘名称搜索'
            />
            <ul className={styles.wrapper_position}>
                <li className={styles.wrapper_position_left}>{cityName}<span className={styles.wrapper_position_left_tip} onClick={this.getPos}>gps定位</span></li>
                <li className={styles.wrapper_position_right} onClick={e => { history.push({ pathname: match.path + '/switchCity', state: { currentCity: cityName } }) }}>切换城市</li>
            </ul>
            {/* 最近历史该功能还没有
            <div className={styles.wrapper_history}>
                <div className={styles.wrapper_history_title}>最近历史</div>
                <ul className={styles.wrapper_history_box}>
                    <li className={styles.wrapper_history_box_item}>无</li>
                </ul>
            </div> */}
            <CustomWhiteSpace />
            <IndexedList
                formatData={(ds) => {
                    const dataBlob = {},
                        sectionIDs = [],
                        rowIDs = [];
                    Object.keys(houses).forEach((item, index) => {
                        sectionIDs.push(item);
                        dataBlob[item] = item;
                        rowIDs[index] = [];
                        houses[item].forEach((jj) => {
                            rowIDs[index].push(jj.id);
                            dataBlob[jj.id] = jj;
                        });
                    });
                    return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
                }}
                renderRow={rowData => <div
                    onClick={e => { whichHouses(rowData); history.goBack() }}
                    className={styles.house}>{rowData.name}</div>
                }
                renderFooter={() => housesLen ? '我是有底线的' : '暂无结果'}
            />
            <Route path={match.path + '/switchCity'} render={props => <SwitchCity {...props} whichCity={this.whichCity} />} />
        </div>)
    }
})