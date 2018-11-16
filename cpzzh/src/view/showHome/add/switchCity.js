import React, { Component } from 'react';
import hasPositionFullScreen from '../../../component/fullScreen/hasPositionFullScreen';
import CustomSearchBar from '../../../component/customSearchBar';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import IndexedList from '../../../component/indexedList';
import { request } from '../../../request';
import { sortAndClassify } from '../../../utlis/hzToPy';
import styles from './switchCity.less';

export default hasPositionFullScreen(class switchCity extends Component {
    state = {
        city: [],
        cityLen: 0,
        formatCity: {}
    }
    componentDidMount() {
        request({ method: 'get', url: '/sfapi/Options/GetPCD' }).then(res => {
            const city = res.city || [];
            this.setState({
                city,
                cityLen: city.length,
                formatCity: sortAndClassify(city, 'fCityName')
            })
        })
    }
    onSearch = keyword => {
        const { city } = this.state,
            suitCity = city.filter(item => item.fCityName.indexOf(keyword) > -1);
        this.setState({
            cityLen: suitCity.length,
            formatCity: sortAndClassify(suitCity, 'fCityName')
        })
    }
    render() {
        const { formatCity, cityLen } = this.state,
            { whichCity, history } = this.props;
        return (<div className={styles.wrapper}>
            <CustomSearchBar
                className={styles.wrapper_search}
                onSearch={this.onSearch}
                placeholder='输入城市搜索'
            />
            <div className={styles.wrapper_position}>
                <div className={styles.wrapper_position_left}>东莞<span className={styles.wrapper_position_left_tip}>当前城市</span></div>
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
                            rowIDs[index].push(jj.fCityID);
                            dataBlob[jj.fCityID] = jj;
                        });
                    });
                    return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
                }}
                renderRow={rowData => <div
                    onClick={e => { whichCity(rowData); history.goBack() }}
                    className={styles.city}>{rowData.fCityName}</div>
                }
                renderFooter={() => cityLen ? '我是有底线的' : '暂无结果'}
            />
        </div>)
    }
})