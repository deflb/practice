import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { List, SwipeAction, ListView, Modal, PullToRefresh, Toast } from 'antd-mobile';
import NoResult from '../../../component/noResult';
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
                dataSource: dataSource.cloneWithRows([..._dataBlobs]),
                isLoading: false,
            })
            pageNo === 1 && this.lv.scrollTo(0, 0)
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

    onRefresh = ({ ...props }) => { console.log(props) }

    del = (rowData, index) => {
        request({ url: api.saveCollects, data: { id: rowData.id, status: 0 } }).then(res => {
            Toast.success(res, 0.7)
            const { dataBlobs, dataSource } = this.state,
                _dataBlobs = [...dataBlobs];
            _dataBlobs.splice(index, 1)
            this.setState({
                dataBlobs: _dataBlobs,
                dataSource: dataSource.cloneWithRows(_dataBlobs)
            })
        }).catch(err => { })
    }

    render() {
        const { height, dataBlobs, dataSource } = this.state, row = (rowData, sectionID, index) => {
            return (
                <SwipeAction
                    key={index}
                    style={{ marginBottom: '0.2rem' }}
                    right={[
                        {
                            text: '删除',
                            onPress: (e) => {
                                alert('提示', '确认删除?', [
                                    { text: '取消', onPress: () => { } },
                                    { text: '确认', onPress: this.del.bind(this, rowData, index) },
                                ])
                            },
                            className: styles.del
                        }
                    ]}
                >
                    <List.Item>
                        <div className={styles.product}>
                            <img src={imgAddress + rowData.surfacePlotUrl} alt={rowData.id} />
                            <p className='titleFontSizeC oneRowOverflowOmit'>{rowData.title}</p>
                            <p className='textFontSizeC twoRowsOverflowOmit'>{rowData.remark}</p>
                            <div className={`${styles.extra} textFontSizeC`}>
                                <span><i className='iconfont icon-chakan' />{rowData.views}</span>
                                <span className='yBoth1px'><i className='iconfont icon-xiaoxi' />{rowData.comments}</span>
                                <span><i className='iconfont icon-i-good' />{rowData.likes}</span>
                            </div>
                        </div>
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
                    onEndReachedThreshold={80}
                    pullToRefresh={<PullToRefresh
                        direction='down'
                        distanceToRefresh={40}
                        onRefresh={this.onRefresh}
                    />}
                />
            </div>
        );
    }
}