import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import { ListView, Card } from 'antd-mobile';
import asyncC from '../../../component/asyncC';
import { request } from '../../../request';
import api from '../../../request/api';
import { formatDate } from '../../../utlis';
import styles from './index.less';
const Detail = asyncC(() => import('./detail'));

export default class message extends Component {
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
    }

    componentDidMount() {
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).getBoundingClientRect().top;
        this.setState({ height: hei })
        this.getMessages()
    }

    getMessages = () => { // 获取消息列表
        const { pageNo, pageSize, dataBlobs, dataSource } = this.state;
        this.setState({ isLoading: true })
        request({ url: api.getMessages, data: { pageNo, pageSize } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                dataBlobs: _dataBlobs,
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataSource: dataSource.cloneWithRows(_dataBlobs),
                isLoading: false
            })
        }).catch(err => { this.setState({ isLoading: false }) })
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getMessages()
    }

    goToDetail = (rowData, index) => {
        if (rowData.isRead === '0') {
            request({ url: api.updateMessageRead, data: { msgId: rowData.msgId } }).then(res => {
                const { dataBlobs, dataSource } = this.state,
                    _dataBlobs = [...dataBlobs],
                    currentRow = { ..._dataBlobs[index] };
                currentRow.isRead = '1';
                _dataBlobs.splice(index, 1, currentRow)
                this.setState({
                    dataBlobs: _dataBlobs,
                    dataSource: dataSource.cloneWithRows(_dataBlobs)
                })
            }).catch(err => { })
        }
        const { history, match } = this.props;
        history.push({
            pathname: match.path + '/detail',
            state: rowData
        })
    }

    render() {
        const { dataSource, height } = this.state,
            { match } = this.props;
        return (
            <div className='bg_grey_list_view'>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={dataSource}
                    renderRow={(item, sectionID, index) => <div>
                        <div className={styles.message_time}>
                            <span>{formatDate(new Date(item.msgDate))}</span>
                        </div>
                        <Card full className={styles.message_content}>
                            <Card.Header
                                title={<div className='oneRowsOverflowOmit'>{item.msgTitle}</div>}
                                extra={<span className={item.isRead === '0' ? styles.message_content_noread : styles.message_content_isread} />}
                            />
                            <Card.Body>
                                <p className='twoRowsOverflowOmit'>{item.msgContent}</p>
                            </Card.Body>
                            <Card.Footer extra={<div className={styles.message_content_view} onClick={this.goToDetail.bind(this, item, index)}>查看详情</div>} />
                        </Card>
                    </div>}
                    style={{ height }}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={30}
                />
                <Route path={match.path + '/detail'} component={Detail} />
            </div>
        );
    }
}