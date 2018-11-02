import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, ListView, Toast } from 'antd-mobile';
import TypeIn from '../typeIn';
import NoResult from '../noResult';
import { request } from '../../request';
import api from '../../request/api';
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
        userInfo: PropTypes.object,
        caseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 案例id
        onSave: PropTypes.func, // 评价保存成功后执行
    }

    static defaultProps = {
        userInfo: {},
        caseId: '',
        onSave: function () { }
    }

    getCommentList = () => { // 获取评论列表
        const { pageNo, pageSize, commentListBlobs, commentListSource } = this.state,
            { caseId } = this.props;
        if (!caseId) return
        this.setState({ isLoading: true })
        request({ url: api.pageCommentList, data: { caseId, pageNo, pageSize } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _commentListBlobs = [...commentListBlobs, ...list];
            this.setState({
                height: !_commentListBlobs.length ? 45 : _commentListBlobs.length === 1 ? 140 : 300,
                commentListBlobs: _commentListBlobs,
                hasMore: _commentListBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                commentListSource: commentListSource.cloneWithRows(_commentListBlobs),
                isLoading: false
            })
        }).catch(err => { this.setState({ isLoading: false }) })
    }

    saveComment = info => { // 保存评论
        const { caseId, userInfo, onSave } = this.props;
        request({ url: api.saveComment, data: { caseId, content: info } }).then(res => {
            Toast.success('评价成功!', 0.7);
            const { commentListBlobs, commentListSource } = this.state, _commentListBlobs = [
                {
                    content: info,
                    createTime: new Date().getTime(),
                    creator: "mt_admin",
                    id: res,
                    replyList: null,
                    timeString: "刚刚",
                    userInfo
                },
                ...commentListBlobs
            ];
            this.setState({
                commentListBlobs: _commentListBlobs,
                commentListSource: commentListSource.cloneWithRows(_commentListBlobs),
            })
            onSave()
        }).catch(err => { })
    }

    componentDidMount() {
        this.getCommentList()
    }

    saveCommentReply = content => { // 保存评论回复
        const { replyItemInfo } = this.state,
            { commentId, replyUserId, index, replyUser } = replyItemInfo;
        request({ url: api.saveCommentReply, data: { commentId, replyUserId, content } }).then(res => {
            Toast.success('回复成功!', 0.7);
            const { commentListBlobs, commentListSource } = this.state,
                now = new Date().getTime(),
                currentRow = commentListBlobs[index],
                { replyList } = currentRow;
            currentRow.replyList = replyList ? [...replyList, { id: now, replyUser, user: '管理员', content }] : [{ id: now, replyUser, user: '管理员', content }]
            this.setState({
                visible: false,
                commentListSource: commentListSource.cloneWithRows(JSON.parse(JSON.stringify(commentListBlobs)))
            })
        }).catch(err => { })
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getCommentList()
    }

    render() {
        const { commentListBlobs, commentListSource, height, visible } = this.state;
        return (<Card full>
            <Card.Header
                title="评价"
            />
            <Card.Body>
                <ListView
                    className='list_view_maybe_comon'
                    dataSource={commentListSource}
                    renderHeader={() => commentListBlobs.length ? null : <NoResult />}
                    renderRow={(item, sectionID, index) => {
                        const { userInfo = {} } = item,
                            { avatar, nickName, name } = userInfo,
                            replyList = item.replyList || [];
                        return <Card key={item.id} full>
                            <Card.Header
                                className={styles.item_header}
                                title={<ul className={styles.item_header_title}>
                                    <li>{nickName || name}</li>
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
                                                replyUserId: userInfo.id,
                                                index,
                                                replyUser: userInfo.nickName
                                            }
                                        })
                                    }}>回复</span>}
                            />
                            <Card.Body className={styles.item_body}>
                                <ul className={styles.item_body_box}>
                                    <li>{item.content}</li>
                                    <li>
                                        <ul>
                                            {replyList.map(val => <li key={val.id}>
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
                    onEndReachedThreshold={30}
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