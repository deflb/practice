import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import {
    ListView,
    // PullToRefresh
} from 'antd-mobile';
import { globalLoadingToggle } from '../../store/action';
import asyncC from '../../component/asyncC';
import TextMaskImageBox from '../../component/textMaskImageBox';
import SearchBar from './common/searchBar';
import Filter from './common/filter';
import { request } from '../../request';
import api from '../../request/api';
import styles from './palette.less';
const Detail = asyncC(() => import('./paletteComponent/detail'));

export default class palette extends Component {
    state = {
        // 色板类别
        classifyList: [], // 列表
        // 色板
        pageNo: 1,
        pageSize: 10,
        bid: '', // 色板类别id
        keyword: '', // 查询关键词
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
            pathname: match.path + '/palette',
            state: rowData
        })
    }
    getPaletteClassify = () => {
        request({ url: api.boardTypeList, data: { pageNo: 1, pageSize: 10, status: 1 } }).then(res => {
            const { list } = res;
            this.setState({ classifyList: list })
        }).catch(err => { console.log(err) })
    }

    getPaletteList = ({ pageNo = this.state.pageNo, keyword = this.state.keyword, dataBlobs = this.state.dataBlobs } = {}) => {
        const { pageSize, bid, dataSource } = this.state,
            { dispatch } = this.props;
        dispatch(globalLoadingToggle(true));
        this.setState({ isLoading: true, bid, keyword })
        request({ url: api.boardDetailList, data: { pageNo, pageSize, status: 1, bid, keyword } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            dispatch(globalLoadingToggle(false));
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                dataSource: dataSource.cloneWithRows(_dataBlobs),
                isLoading: false,
            })
            pageNo === 1 && this.lv.scrollTo(0, 0)
        }).catch(err => {
            this.setState({ isLoading: false });
            dispatch(globalLoadingToggle(false));
        })
    }

    componentDidMount() {
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).getBoundingClientRect().top;
        this.setState({ height: hei })
        this.getPaletteClassify()
        this.getPaletteList()
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getPaletteList()
    }

    // updateList = () => { // 更新list (下拉刷新)
    //     const { dataBlobs, dataSource, bid, keyword } = this.state,
    //         len = dataBlobs.length;
    //     request({ url: api.boardDetailList, data: { pageNo: 1, pageSize: len, status: 1, bid, keyword } }).then(res => {
    //         const { list, pageTurn } = res,
    //             { rowCount } = pageTurn;
    //         this.setState({
    //             hasMore: list.length >= rowCount ? false : true,
    //             dataBlobs: list,
    //             dataSource: dataSource.cloneWithRows(list),
    //         })
    //     }).catch(error => { })
    // }

    onSearch = keyword => {
        if (keyword !== this.state.keyword)
            this.getPaletteList({ pageNo: 1, keyword, dataBlobs: [] })
    }

    onOk = () => {
        this.getPaletteList({ pageNo: 1, dataBlobs: [] })
    }

    render() {
        const {
            classifyList,
            bid,
            dataBlobs,
            dataSource,
            height,
            isLoading,
        } = this.state, { match } = this.props;
        return (
            <div>
                <SearchBar
                    placeholder='请输入色板名称'
                    extra={<Filter
                        onRest={() => {
                            this.setState({
                                bid: ''
                            })
                        }}
                        onOk={this.onOk}
                    >
                        <ul className={styles.filter_wrapper}>
                            {[
                                { id: '', name: '全部' },
                                ...classifyList
                            ].map(item => <li
                                className={bid === item.id ? styles.active : null}
                                key={item.id}
                                onClick={e => { this.setState({ bid: item.id }) }}
                            >{item.name}</li>)}
                        </ul>
                    </Filter>}
                    onSearch={this.onSearch}
                />
                <div className='bg_grey_list_view'>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={dataSource}
                        renderFooter={() => isLoading ? '加载中...' : dataBlobs.length ? '我是有底线的' : '暂无结果'}
                        renderRow={(rowData, sectionID, rowID) => {
                            const { id, imgUrl, title } = rowData;
                            return <TextMaskImageBox
                                style={{ width: '49%', marginRight: rowID % 2 === 0 ? '2%' : null, marginBottom: 10 }}
                                onClick={this.goToDetail.bind(this, { id })}
                                rowData={{ imgUrl, title }}
                            />
                        }}
                        style={{
                            height
                        }}
                        onEndReached={this.onEndReached}
                    // onEndReachedThreshold={60}
                    // pullToRefresh={<PullToRefresh
                    //     direction='down'
                    //     distanceToRefresh={40}
                    //     onRefresh={this.updateList}
                    // />}
                    />
                </div>
                <Route path={match.path + '/palette'} component={Detail} />
            </div>
        );
    }
}