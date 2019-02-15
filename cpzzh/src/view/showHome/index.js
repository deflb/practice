import React, { Component } from 'react';
import { connect } from 'react-redux';
import CustomListView from '../../component/customListView';
import TypesClassifySelect from '../../component/typesClassifySelect';
import IconFixedPage from '../../component/iconFixedPage';
import CustomSearchBar from '../../component/customSearchBar';
import ShowHomeItem from '../../component/itemPreView/showHomeItem';
import CustomModal from '../../component/customModal';
import { request } from '../../request';
import api from '../../request/api';
import styles from './index.less';
import routerBase from '../../router/routerBase';

export default connect(state => ({
    userInfo: state.userInfo
}))(class showHome extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        refreshing: false,
        loading: false,
        type: '',
        keyword: '', // 关键字
    }

    getList = ({
        pageNo = this.state.pageNo,
        type = this.state.type,
        keyword = this.state.keyword,
        dataBlobs = this.state.dataBlobs,
    } = {}) => {
        const { pageSize } = this.state;
        this.setState({ loading: true, keyword, type })
        request({ url: api.houseShowList, data: { pageNo, pageSize, type, keyword } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                loading: false,
                refreshing: false
            })
            pageNo === 1 && this.listView.scrollTo(0, 0)
        }).catch(err => {
            this.setState({ loading: false, refreshing: false });
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.getList({ pageNo: 1, dataBlobs: [] })
    }

    onEndReachedonEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getList()
    }

    onSearch = keyword => {
        if (keyword !== this.state.keyword)
            this.getList({ pageNo: 1, keyword, dataBlobs: [] })
    }

    add = () => {
        let { userInfo, dispatch, history } = this.props;
        if (CustomModal.verify({ dispatch, userInfo }))
            history.push(routerBase + '/addShowHome')
    }

    addComplete = () => {
        const { history } = this.props;
        history.goBack();
    }

    updateCurrentItem = (field, index) => { // viewCount commentCount likeCount
        if (!field || (!index && index !== 0)) return;
        const { dataBlobs } = this.state,
            _dataBlobs = [...dataBlobs],
            currentRow = { ..._dataBlobs[index] };
        if (field === 'likeCount') {
            if (!currentRow.isLike) {
                currentRow.isLike = 1;
                currentRow[field]++;
            } else {
                currentRow.isLike = 0;
                currentRow[field]--;
            }
        } else
            currentRow[field]++;
        _dataBlobs.splice(index, 1, currentRow)
        this.setState({ dataBlobs: _dataBlobs })
    }

    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }

    render() {
        const { dataBlobs, loading, refreshing } = this.state,
            { history } = this.props;
        return (<IconFixedPage onAdd={this.add}>
            <div className={styles.wrapper}>
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
                <CustomListView
                    style={{ flex: 1 }}
                    getListViewInstance={instance => this.listView = instance}
                    loading={loading}
                    data={dataBlobs}
                    onEndReached={this.onEndReached}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    renderRow={(rowData, sectionID, index) => (<ShowHomeItem
                        key={rowData.id}
                        style={{ marginBottom: 10 }}
                        rowClick={() => {
                            history.push({
                                pathname: routerBase + '/showHomeDetail',
                                state: { index, id: rowData.id }
                            })
                        }}
                        rowData={rowData}
                        updateLikeCount={this.updateCurrentItem.bind(this, 'likeCount', index)}
                    />)}
                />
            </div>
        </IconFixedPage>)
    }
})