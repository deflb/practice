import React, { Component } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { Toast } from 'antd-mobile';
import asyncC from '../../../component/asyncC';
import CustomListView from '../../../component/customListView';
import IconFixedPage from '../../../component/iconFixedPage';
import LeftDragDelete from '../../../component/leftDragDelete';
import ShowHomeItem from '../../../component/itemPreView/showHomeItem';
import CustomModal from '../../../component/customModal';
import { request } from '../../../request';
import api from '../../../request/api';
const AddOrEdit = asyncC(() => import('../../showHome/addOrEdit'));
const Detail = asyncC(() => import('../../showHome/detail'));

export default connect(state => ({
    userInfo: state.userInfo
}))(class showHome extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
        refreshing: false,
    }

    getList = ({
        pageNo = this.state.pageNo,
        dataBlobs = this.state.dataBlobs,
    } = {}) => {
        const { pageSize } = this.state;
        this.setState({ loading: true })
        request({ url: api.myHouseShowList, data: { pageNo, pageSize } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                loading: false,
                refreshing: false
            });
        }).catch(err => {
            this.setState({ loading: false, refreshing: false });
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.getList({ pageNo: 1, dataBlobs: [] })
    }

    updateList = () => {
        const { dataBlobs } = this.state,
            len = dataBlobs.length;
        request({ url: api.myHouseShowList, data: { pageNo: 1, pageSize: len } }).then(res => {
            const { list, pageTurn } = res,
                { rowCount } = pageTurn;
            this.setState({
                hasMore: list.length >= rowCount ? false : true,
                dataBlobs: list
            })
        }).catch(error => { })
    }

    componentDidMount() {
        this.getList();
    }

    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getList()
    }

    add = () => {
        let { userInfo, dispatch, match, history } = this.props;
        if (CustomModal.verify({ dispatch, userInfo }))
            history.push(match.path + '/add')
    }

    addComplete = () => {
        this.props.history.goBack();
        this.getList({ pageNo: 1, dataBlobs: [] })
    }

    backToList = () => {
        this.props.history.go(-1);
        this.updateList()
    }

    del = id => {
        request({ url: api.houseShowDelete, data: { id } }).then(res => {
            this.setState({ visible: false });
            Toast.success(res, 0.7);
            this.updateList()
        }).catch(err => { })
    }

    updateCurrentItem = (field, index) => { // viewCount commentCount likeCount
        if (!field) return;
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
            { match, history } = this.props;
        return (<IconFixedPage onAdd={this.add}>
            <CustomListView
                style={{ height: '100%' }}
                loading={loading}
                data={dataBlobs}
                onEndReached={this.onEndReached}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                renderRow={(rowData, sectionID, index) => (<LeftDragDelete
                    key={rowData.id}
                    style={{ marginBottom: 10 }}
                    onClick={() => {
                        CustomModal.alert({
                            message: '确认删除?', actions: [
                                { text: '取消' },
                                { text: '确认', onPress: this.del.bind(this, rowData.id) }
                            ]
                        })
                    }}
                >
                    <ShowHomeItem
                        rowClick={() => {
                            history.push({
                                pathname: match.path + '/detail',
                                state: { index, id: rowData.id, auditStatus: rowData.auditStatus }
                            })
                        }}
                        rowData={{ ...rowData }}
                        updateLikeCount={this.updateCurrentItem.bind(this, 'likeCount', index)}
                    />
                </LeftDragDelete>)}
            />
            <Route path={match.path + '/add'} render={props => <AddOrEdit {...props} onComplete={this.addComplete} />} />
            <Route path={match.path + '/detail'} render={props => <Detail {...props} updateCurrentItem={this.updateCurrentItem} parentPath={match.path} />} />
            <Route path={match.path + '/edit'} render={props => <AddOrEdit {...props} onComplete={this.backToList} />} />
        </IconFixedPage>)
    }
})