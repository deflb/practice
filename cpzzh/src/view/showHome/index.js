import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { globalLoadingToggle } from '../../store/action';
import { ListView } from 'antd-mobile';
import TypesClassifySelect from '../../component/typesClassifySelect';
import asyncC from '../../component/asyncC';
import CustomSearchBar from '../../component/customSearchBar';
import CasePdLookAnother from '../../component/casePdLook/another';
import { request } from '../../request';
import api from '../../request/api';
import styles from './index.less';
const Add = asyncC(() => import('./add'));
const Detail = asyncC(() => import('./detail'));

export default connect()(class showHome extends Component {
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
        type: '',
        keyword: '', // 关键字
    }

    getList = ({
        pageNo = this.state.pageNo,
        type = this.state.type,
        keyword = this.state.keyword,
        dataBlobs = this.state.dataBlobs,
    } = {}) => {
        const { pageSize, dataSource } = this.state,
            { dispatch } = this.props;
        dispatch(globalLoadingToggle(true));
        this.setState({ isLoading: true, keyword, type })
        request({ url: api.houseShowList, data: { pageNo, pageSize, type, keyword } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            dispatch(globalLoadingToggle(false));
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                dataSource: dataSource.cloneWithRows([..._dataBlobs]),
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
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getList()
    }

    onSearch = keyword => {
        if (keyword !== this.state.keyword)
            this.getList({ pageNo: 1, keyword, dataBlobs: [] })
    }

    add = () => {
        const { match, history } = this.props;
        history.push(match.path + '/add')
    }

    render() {
        const { dataSource, dataBlobs, height, isLoading } = this.state,
            { match, history } = this.props;
        return (<div className={styles.wrapper}>
            <CustomSearchBar
                onSearch={this.onSearch}
                placeholder='请输入关键字'
            />
            <TypesClassifySelect
                source={[
                    { title: '最新', val: 1 },
                    { title: '人气', val: 2 },
                    { title: '点赞', val: 3 },
                    { title: '收藏', val: 4 },
                ]}
                itemClick={val => { this.getList({ pageNo: 1, dataBlobs: [], type: val }) }}
            />
            <div className='bg_grey_list_view'>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={dataSource}
                    renderFooter={() => isLoading ? '加载中...' : dataBlobs.length ? '我是有底线的' : '暂无结果'}
                    renderRow={(rowData, sectionID, index) => {
                        const { id, cover, title, viewCount, commentCount, likeCount } = rowData;
                        return <CasePdLookAnother
                            style={{ marginBottom: 10 }}
                            rowClick={() => {
                                history.push({
                                    pathname: match.path + '/detail',
                                    state: { id, index }
                                })
                            }}
                            rowData={{ index, id, surfacePlotUrl: cover, title, views: viewCount, comments: commentCount, likes: likeCount }}
                        // updateCurrentItem={this.updateCurrentItem}
                        />
                    }}
                    style={{ height }}
                    onEndReached={this.onEndReached}
                // onEndReachedThreshold={80}
                />
            </div>
            <div className={styles.wrapper_add} onClick={this.add}>+</div>
            <Route path={match.path + '/add'} component={Add} />
            <Route path={match.path + '/detail'} component={Detail} />
        </div>)
    }
})