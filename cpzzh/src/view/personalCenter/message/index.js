import React, { Component } from 'react';
import { Route } from 'react-router';
import { Card } from 'antd-mobile';
import asyncC from '../../../component/asyncC';
import CustomListView from '../../../component/customListView';
import list_thumb_png from '../../../assets/image/list_thumb.png';
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
        loading: false,
        refreshing: false
    }

    componentDidMount() {
        this.getMessages()
    }

    getMessages = ({
        pageNo = this.state.pageNo,
        dataBlobs = this.state.dataBlobs,
    } = {}) => { // 获取消息列表
        const { pageSize } = this.state;
        this.setState({ loading: true })
        request({ url: api.getMessages, data: { pageNo, pageSize } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                dataBlobs: _dataBlobs,
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                loading: false,
                refreshing: false
            })
        }).catch(err => {
            this.setState({ loading: false, refreshing: false });
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.getMessages({ pageNo: 1, dataBlobs: [] })
    }

    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getMessages()
    }

    goToDetail = (rowData, index) => {
        if (rowData.isRead === '0') {
            request({ url: api.updateMessageRead, data: { msgId: rowData.msgId } }).then(res => {
                const { dataBlobs } = this.state,
                    _dataBlobs = [...dataBlobs],
                    currentRow = { ..._dataBlobs[index] };
                currentRow.isRead = '1';
                _dataBlobs.splice(index, 1, currentRow)
                this.setState({ dataBlobs: _dataBlobs })
            }).catch(err => { })
        }
        const { history, match } = this.props;
        history.push({
            pathname: match.path + '/detail',
            state: rowData
        })
    }

    render() {
        const { dataBlobs, loading, refreshing } = this.state,
            { match } = this.props;
        return (
            <div style={{ height: '100%' }}>
                <CustomListView
                    style={{ height: '100%' }}
                    loading={loading}
                    data={dataBlobs}
                    onEndReached={this.onEndReached}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    renderRow={(rowData, sectionID, index) => (<div key={rowData.msgId}>
                        <div className={styles.message_time}>
                            <span>{formatDate(rowData.msgDate)}</span>
                        </div>
                        <Card full className={styles.message_content}>
                            <Card.Header
                                title={<div className='oneRowsOverflowOmit'>{rowData.msgTitle}</div>}
                                extra={<span className={rowData.isRead === '0' ? styles.message_content_noread : styles.message_content_isread} />}
                            />
                            <Card.Body>
                                <ul className={styles.message_content_simple}>
                                    <img src={list_thumb_png} alt='' />
                                    <li className={styles.message_content_simple_text}>{rowData.msgContent}</li>
                                </ul>
                            </Card.Body>
                            <Card.Footer extra={<div className={styles.message_content_view} onClick={this.goToDetail.bind(this, rowData, index)}>查看详情</div>} />
                        </Card>
                    </div>)}
                />
                <Route path={match.path + '/detail'} component={Detail} />
            </div>
        );
    }
}