import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { List, SwipeAction, ListView, Modal, PullToRefresh, Toast } from 'antd-mobile';
import NoResult from '../../../component/noResult';
import CasePdLook from '../../../component/casePdLook';
import { request } from '../../../request';
import api from '../../../request/api';
import { imgAddress } from '../../../request/baseURL';
import styles from './index.less';
const { alert } = Modal;

export default class collect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 1,
            pageSize: 10,
            hasMore: true,
            dataBlobs: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            isLoading: false,
            height: 0,
            keyword: '', // 关键字
        };
    }

    getCaseList = ({
        pageNo = this.state.pageNo,
        keyword = this.state.keyword,
        dataBlobs = this.state.dataBlobs,
    } = {}) => {
        const { pageSize, dataSource } = this.state;
        this.setState({ isLoading: true, keyword })
        request({ url: api.caseCollectList, data: { pageNo, pageSize, keyword } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                dataSource: dataSource.cloneWithRows(_dataBlobs),
                isLoading: false,
            })
        }).catch(err => { this.setState({ isLoading: false }) })
    }

    componentDidMount() {
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).getBoundingClientRect().top;
        this.setState({ height: hei })
        this.getCaseList()
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getCaseList()
    }

    updateList = () => { // 更新list (删除|下拉刷新)
        const { dataBlobs, dataSource, keyword } = this.state,
            len = dataBlobs.length;
        request({ url: api.caseCollectList, data: { pageNo: 1, pageSize: len, keyword } }).then(res => {
            const { list, pageTurn } = res,
                { rowCount } = pageTurn;
            this.setState({
                hasMore: list.length >= rowCount ? false : true,
                dataBlobs: list,
                dataSource: dataSource.cloneWithRows(list),
            })
        }).catch(error => { })
    }

    del = (rowData) => {
        request({ url: api.saveCollects, data: { id: rowData.id, status: 0 } }).then(res => {
            Toast.success(res, 0.7);
            this.updateList()
        }).catch(err => { })
    }

    updateCurrentItem = (field, index) => { // views comments likes
        if (!field) return;
        const { dataBlobs, dataSource } = this.state,
            _dataBlobs = [...dataBlobs],
            currentRow = { ..._dataBlobs[index] };
        currentRow[field]++;
        _dataBlobs.splice(index, 1, currentRow)
        this.setState({
            dataBlobs: _dataBlobs,
            dataSource: dataSource.cloneWithRows(_dataBlobs)
        })
    }

    render() {
        const { height, dataBlobs, dataSource, isLoading } = this.state, row = (rowData, sectionID, index) => {
            rowData.index = index;
            rowData.des = rowData.styleName;
            rowData.imgUrl = imgAddress + rowData.surfacePlotUrl;
            return (
                <SwipeAction
                    key={rowData.id}
                    style={{ marginBottom: 10 }}
                    right={[
                        {
                            text: '删除',
                            onPress: (e) => {
                                alert('提示', '确认删除?', [
                                    { text: '取消', onPress: () => { } },
                                    { text: '确认', onPress: this.del.bind(this, rowData) },
                                ])
                            },
                            className: styles.del
                        }
                    ]}
                >
                    <List.Item>
                        <CasePdLook
                            rowData={rowData}
                            updateCurrentItem={this.updateCurrentItem}
                        />
                    </List.Item>
                </SwipeAction>
            );
        };

        return (
            <div className='bg_grey_list_view'>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={dataSource}
                    renderHeader={() => dataBlobs.length ? null : <NoResult />}
                    renderRow={row}
                    style={{
                        height
                    }}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                    pullToRefresh={<PullToRefresh
                        refreshing={isLoading}
                        direction='down'
                        distanceToRefresh={40}
                        onRefresh={this.updateList}
                    />}
                />
            </div>
        );
    }
}