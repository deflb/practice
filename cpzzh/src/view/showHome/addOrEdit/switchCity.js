import React, { Component } from 'react';
import hasPositionFullScreen from '../../../component/fullScreen/hasPositionFullScreen';
import CustomSearchBar from '../../../component/customSearchBar';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import IndexedList from '../../../component/indexedList';
import { request } from '../../../request';
import api from '../../../request/api';
import { sortAndClassify } from '../../../utlis/hzToPy';
import styles from './switchCity.less';

export default hasPositionFullScreen(class switchCity extends Component {
    state = {
        keyword: '',
        city: [],
        formatCity: {},
    }
    getCity = () => {
        request({ url: api.getCity }).then(res => {
            const data = res || [], _data = sortAndClassify(data, 'name');
            sessionStorage.setItem('cityData', JSON.stringify({
                city: data,
                formatCity: _data
            }));
            this.setState({ city: data, formatCity: _data })
        })
    }
    componentDidMount() {
        const cityData = sessionStorage.getItem('cityData');
        if (cityData) {
            const _cityData = JSON.parse(cityData);
            this.setState({ city: _cityData.city, formatCity: _cityData.formatCity })
        } else
            this.getCity()
    }
    onSearch = keyword => {
        if (keyword === this.state.keyword) return
        this.setState({ keyword })
        if (!keyword) {
            const cityData = sessionStorage.getItem('cityData');
            if (cityData) {
                this.setState({ formatCity: JSON.parse(cityData).formatCity })
            }
            return
        }
        const { city } = this.state, result = city.filter(item => new RegExp(keyword).test(item.name));
        this.setState({ formatCity: sortAndClassify(result, 'name') })
    }
    render() {
        const { formatCity, city } = this.state,
            { whichCity, history, location } = this.props,
            { state = {} } = location;
        return (<div className={styles.wrapper}>
            <CustomSearchBar
                className={styles.wrapper_search}
                onSearch={this.onSearch}
                placeholder='输入城市搜索'
            />
            <div className={styles.wrapper_position}>
                <div className={styles.wrapper_position_left}>{state.currentCity}<span className={styles.wrapper_position_left_tip}>当前城市</span></div>
            </div>
            <CustomWhiteSpace />
            <IndexedList
                formatData={(ds) => {
                    const dataBlob = {},
                        sectionIDs = [],
                        rowIDs = [];
                    Object.keys(formatCity).forEach((item, index) => {
                        sectionIDs.push(item);
                        dataBlob[item] = item;
                        rowIDs[index] = [];
                        formatCity[item].forEach((jj) => {
                            rowIDs[index].push(jj.id);
                            dataBlob[jj.id] = jj;
                        });
                    });
                    return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
                }}
                renderRow={rowData => <div
                    onClick={e => { whichCity(rowData); history.goBack() }}
                    className={styles.city}>{rowData.name}</div>
                }
                renderFooter={() => city.length ? '我是有底线的' : '暂无结果'}
            />
        </div>)
    }
})