import React, { Component } from 'react';
import { Route } from 'react-router';
import hasPositionFullScreen from '../../../component/fullScreen/hasPositionFullScreen';
import CustomSearchBar from '../../../component/customSearchBar';
import IndexedList from '../../../component/indexedList';
import asyncC from '../../../component/asyncC';
import { request } from '../../../request';
import { sortAndClassify } from '../../../utlis/hzToPy';
import styles from './selectHouses.less';
const SwitchCity = asyncC(() => import('./switchCity'));

export default hasPositionFullScreen(class selectHouses extends Component {
    state = {
        buildName: '东莞',
        // 查询
        cityID: '',
        keyword: '',

        houses: [],
        housesLen: 0,
    }
    getHouse = ({ cityID = this.state.cityID, keyword = this.state.keyword } = {}) => {
        const param = {};
        if (cityID) param.cityID = cityID;
        if (keyword) param.buildName = keyword;
        request({ url: '/sfapi/Customers/GetBuildingList', data: param }).then(res => {
            const data = res.list || [];
            this.setState({ housesLen: data.length, houses: sortAndClassify(data, 'buildName') })
        })
    }
    componentDidMount() {
        this.getHouse()
    }

    onSearch = keyword => {
        if (keyword !== this.state.keyword)
            this.getHouse({ keyword })
    }

    whichCity = data => {
        const { cityID, buildName } = data;
        this.getHouse({ cityID })
        this.setState({ buildName, cityID })
    }

    render() {
        const { buildName, houses, housesLen } = this.state,
            { match, history, whichHouses } = this.props;
        return (<div className={styles.wrapper}>
            <CustomSearchBar
                className={styles.wrapper_search}
                onSearch={this.onSearch}
                placeholder='输入楼盘名称搜索'
            />
            <ul className={styles.wrapper_position}>
                <li className={styles.wrapper_position_left}>{buildName}<span className={styles.wrapper_position_left_tip}>gps定位</span></li>
                <li className={styles.wrapper_position_right} onClick={e => { history.push(match.path + '/switchCity') }}>切换城市</li>
            </ul>
            <div className={styles.wrapper_history}>
                <div className={styles.wrapper_history_title}>最近历史</div>
                <ul className={styles.wrapper_history_box}>
                    <li className={styles.wrapper_history_box_item}>13323</li>
                    <li className={styles.wrapper_history_box_item}>13323</li>
                    <li className={styles.wrapper_history_box_item}>13323</li>
                    <li className={styles.wrapper_history_box_item}>13323</li>
                    <li className={styles.wrapper_history_box_item}>13323</li>
                    <li className={styles.wrapper_history_box_item}>13323</li>
                    <li className={styles.wrapper_history_box_item}>13323</li>
                    <li className={styles.wrapper_history_box_item}>13323</li>
                    <li className={styles.wrapper_history_box_item}>13323</li>
                </ul>
            </div>
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
                            rowIDs[index].push(jj.buildID);
                            dataBlob[jj.buildID] = jj;
                        });
                    });
                    return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
                }}
                renderRow={rowData => <div
                    onClick={e => { whichHouses(rowData); history.goBack() }}
                    className={styles.house}>{rowData.buildName}</div>
                }
                renderFooter={() => housesLen ? '我是有底线的' : '暂无结果'}
            />
            <Route path={match.path + '/switchCity'} render={props => <SwitchCity {...props} whichCity={this.whichCity} />} />
        </div>)
    }
})