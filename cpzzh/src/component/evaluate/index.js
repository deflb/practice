import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, ListView, Toast } from 'antd-mobile';
import TypeIn from '../typeIn';
import { request } from '../../request';
import { imgAddress } from '../../request/baseURL';
import styles from './index.less';

export default class evaluate extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        commentListBlobs: [],
        commentListSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
        isLoading: false,
        height: 0,

        visible: false, // 回复是否显示
    }

    static propTypes = {
        listApi: PropTypes.string, // 评价列表api
        replyApi: PropTypes.string, // 回复评价api
        commentApi: PropTypes.string, // 评价api
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // id
        field: PropTypes.string, // 接口字段键
        onSave: PropTypes.func, // 评价保存成功后执行
    }

    static defaultProps = {
        listApi: '',
        replyApi: '',
        commentApi: '',
        id: '',
        field: 'id',
        onSave: function () { }
    }

    getCommentList = () => { // 获取评论列表
        const { pageNo, pageSize, commentListBlobs, commentListSource } = this.state,
            { id, field, listApi } = this.props;
        if (!id) return
        this.setState({ isLoading: true });
        const data = { pageNo, pageSize };
        data[field] = id;
        request({ url: listApi, data }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _commentListBlobs = [...commentListBlobs, ...list];
            this.setState({
                height: !_commentListBlobs.length ? 45 : _commentListBlobs.length === 1 ? 200 : 350,
                commentListBlobs: _commentListBlobs,
                hasMore: _commentListBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                commentListSource: commentListSource.cloneWithRows(_commentListBlobs),
                isLoading: false
            })
        }).catch(err => { this.setState({ isLoading: false }) })
    }

    updateCommentList = () => { // 更新
        const { commentListBlobs, commentListSource } = this.state,
            { id, field, listApi } = this.props,
            len = commentListBlobs.length < 10 ? 10 : commentListBlobs.length;
        if (!id) return;
        const data = { pageNo: 1, pageSize: len };
        data[field] = id;
        request({ url: listApi, data }).then(res => {
            const { list, pageTurn } = res,
                { rowCount } = pageTurn;
            this.setState({
                height: !list.length ? 45 : list.length === 1 ? 200 : 350,
                hasMore: list.length >= rowCount ? false : true,
                commentListBlobs: list,
                commentListSource: commentListSource.cloneWithRows(list),
            })
        }).catch(error => { })
    }

    saveComment = info => { // 保存评论
        const { id, field, onSave, commentApi } = this.props,
            data = { content: info };
        data[field] = id;
        request({ url: commentApi, data }).then(res => {
            Toast.success('评价成功!', 0.7);
            this.updateCommentList()
            onSave()
        }).catch(err => { })
    }

    componentDidMount() {
        this.getCommentList()
    }

    saveCommentReply = content => { // 保存评论回复
        const { replyItemInfo } = this.state,
            { commentId, replyUserId } = replyItemInfo,
            { replyApi } = this.props;
        request({ url: replyApi, data: { commentId, replyUserId, content } }).then(res => {
            Toast.success('回复成功!', 0.7);
            this.setState({ visible: false })
            this.updateCommentList()
        }).catch(err => { })
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getCommentList()
    }

    render() {
        const { commentListBlobs, commentListSource, height, visible, isLoading } = this.state;
        return (<Card full style={{ paddingBottom: 0 }}>
            <Card.Header
                title="评价"
            />
            <Card.Body style={{ paddingBottom: 0 }}>
                <ListView
                    dataSource={commentListSource}
                    renderFooter={() => isLoading ? '加载中...' : commentListBlobs.length ? '我是有底线的' : '暂无结果'}
                    renderRow={(item, sectionID, index) => {
                        const { userInfo = {} } = item,
                            { avatar, nickName } = userInfo,
                            replyList = item.replyList || [];
                        return <Card key={item.id} full>
                            <Card.Header
                                className={styles.item_header}
                                title={<ul className={styles.item_header_title}>
                                    <li>{nickName}</li>
                                    <li>{Number(index) + 1}楼 {item.timeString}</li>
                                </ul>}
                                thumb={<div className={styles.item_header_avatar}>{avatar ? <img src={imgAddress + avatar} alt='' /> : null}</div>}
                                extra={<span
                                    className={styles.item_header_reply}
                                    onClick={e => {
                                        this.setState({
                                            visible: true,
                                            replyItemInfo: {
                                                commentId: item.id,
                                                replyUserId: userInfo.id
                                            }
                                        })
                                    }}>回复</span>}
                            />
                            <Card.Body className={styles.item_body}>
                                <ul className={styles.item_body_box}>
                                    <li className={styles.item_body_box_text}>{item.content}</li>
                                    <li>
                                        <ul>
                                            {replyList.map(val => <li key={val.id} className={styles.item_body_box_text}>
                                                <span className={styles.tip}>{val.user}</span >：<span className={styles.tip}>@{val.replyUser}</span> {val.content}
                                            </li>)}
                                        </ul>
                                    </li>
                                </ul>
                            </Card.Body>
                        </Card>
                    }}
                    style={{
                        height,
                    }}
                    onEndReached={this.onEndReached}
                // onEndReachedThreshold={1}
                />
                <TypeIn
                    visible={visible}
                    onClose={() => { this.setState({ visible: false }) }}
                    onSend={this.saveCommentReply}
                    config={{
                        placeholder: "写回复"
                    }}
                />
            </Card.Body>
        </Card>)
    }
}