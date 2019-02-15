import React, { Component } from 'react';
import { Route } from 'react-router';
import asyncC from '../../component/asyncC';
import CustomListView from '../../component/customListView';
import TextMaskImageBox from '../../component/textMaskImageBox';
import CustomSearchBar from '../../component/customSearchBar';
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
        loading: false,
        refreshing: false,
    }
    goToDetail = rowData => {
        const { history, match } = this.props;
        history.push({
            pathname: match.path + '/palette',
            state: {id: rowData.id}
        })
    }
    getPaletteClassify = () => {
        request({ url: api.boardTypeList, data: { pageNo: 1, pageSize: 10, status: 1 } }).then(res => {
            const { list } = res;
            this.setState({ classifyList: list })
        }).catch(err => { })
    }

    getPaletteList = ({ pageNo = this.state.pageNo, keyword = this.state.keyword, dataBlobs = this.state.dataBlobs } = {}) => {
        const { pageSize, bid } = this.state;
        this.setState({ loading: true, bid, keyword })
        request({ url: api.boardDetailList, data: { pageNo, pageSize, status: 1, bid, keyword } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                loading: false,
                refreshing: false,
            })
            pageNo === 1 && this.listView.scrollTo(0, 0)
        }).catch(err => {
            this.setState({ loading: false, refreshing: false });
        })
    }

    componentDidMount() {
        this.getPaletteClassify()
        this.getPaletteList()
    }

    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getPaletteList()
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.getPaletteList({ pageNo: 1, dataBlobs: [] })
    }

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
            loading,
            refreshing
        } = this.state, { match } = this.props;
        return (
            <div className={styles.wrapper}>
                <CustomSearchBar
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
                <CustomListView
                    style={{ flex: 1 }}
                    getListViewInstance={instance => this.listView = instance}
                    loading={loading}
                    data={dataBlobs}
                    onEndReached={this.onEndReached}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    renderRow={(rowData, sectionID, rowID) => {
                        const { id, imgUrl, title } = rowData;
                        return <TextMaskImageBox
                            style={{ width: '49%', marginRight: rowID % 2 === 0 ? '2%' : null, marginBottom: 10 }}
                            onClick={this.goToDetail.bind(this, { id })}
                            rowData={{ imgUrl, title }}
                        />
                    }}
                />
                <Route path={match.path + '/palette'} component={Detail} />
            </div>
        );
    }
}