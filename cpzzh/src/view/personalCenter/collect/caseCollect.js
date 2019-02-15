import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import LeftDragDelete from '../../../component/leftDragDelete';
import CustomListView from '../../../component/customListView';
import CaseItem from '../../../component/itemPreView/caseItem';
import CustomModal from '../../../component/customModal';
import { request } from '../../../request';
import api from '../../../request/api';
import routerBase from '../../../router/routerBase';

export default class caseCollect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 1,
            pageSize: 10,
            hasMore: true,
            dataBlobs: [],
            loading: false,
            refreshing: false,
        };
    }

    getCaseList = ({
        pageNo = this.state.pageNo,
        dataBlobs = this.state.dataBlobs,
    } = {}) => {
        const { pageSize } = this.state;
        this.setState({ loading: true })
        request({ url: api.caseCollectList, data: { pageNo, pageSize } }).then(res => {
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
        }).catch(err => {
            this.setState({ loading: false, refreshing: false });
        })
    }

    componentDidMount() {
        this.getCaseList()
    }

    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getCaseList()
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.getCaseList({ pageNo: 1, dataBlobs: [] })
    }

    updateList = () => {
        const { dataBlobs } = this.state,
            len = dataBlobs.length + 1;
        request({ url: api.caseCollectList, data: { pageNo: 1, pageSize: len } }).then(res => {
            const { list, pageTurn } = res,
                { rowCount } = pageTurn;
            this.setState({
                hasMore: list.length >= rowCount ? false : true,
                dataBlobs: list
            })
        }).catch(error => { })
    }

    del = id => {
        request({ url: api.saveCollects, data: { id, status: 0 } }).then(res => {
            Toast.success(res, 0.7);
            this.updateList()
        }).catch(err => { })
    }

    updateCurrentItem = (field, index) => { // views comments likes
        if (!field || (!index && index !== 0)) return;
        const { dataBlobs } = this.state;
        if (dataBlobs.length) {
            const _dataBlobs = [...dataBlobs],
                currentRow = { ..._dataBlobs[index] };
            currentRow[field]++;
            _dataBlobs.splice(index, 1, currentRow)
            this.setState({ dataBlobs: _dataBlobs })
        }
    }

    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }

    render() {
        const { dataBlobs, loading, refreshing } = this.state,
            { history } = this.props;
        return (<CustomListView
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
                <CaseItem
                    rowClick={() => {
                        history.push({
                            pathname: `${routerBase}/caseDetail/?id=${rowData.id}`,
                            state: { id: rowData.id, index }
                        })
                    }}
                    rowData={rowData}
                    updateLikeCount={this.updateCurrentItem.bind(this, 'likes', index)}
                />
            </LeftDragDelete>)}
        />);
    }
}