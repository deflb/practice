import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import CustomListView from '../customListView';
import typeIn from '../typeIn';
import TitleContent from '../titleContent';
import { request } from '../../request';
import whichImgLink from '../../utlis/whichImgLink';
import styles from './index.less';

export default class evaluate extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        commentListBlobs: [],
        loading: false,
        height: 0,
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

    getCommentList = ({ pageNo = this.state.pageNo, commentListBlobs = this.state.commentListBlobs } = {}) => { // 获取评论列表
        const { pageSize } = this.state,
            { id, field, listApi } = this.props;
        if (!id) return
        this.setState({ loading: true });
        const data = { pageNo, pageSize };
        data[field] = id;
        request({ url: listApi, data }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _commentListBlobs = [...commentListBlobs, ...list];
            this.setState({
                height: !_commentListBlobs.length ? 60 : _commentListBlobs.length === 1 ? 200 : 350,
                commentListBlobs: _commentListBlobs,
                hasMore: _commentListBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                loading: false
            });
            pageNo === 1 && this.listView.scrollTo(0, 0);
        }).catch(err => { this.setState({ loading: false }) })
    }

    updateCommentList = () => { // 更新
        const { commentListBlobs } = this.state,
            { id, field, listApi } = this.props,
            len = commentListBlobs.length < 10 ? 10 : commentListBlobs.length;
        if (!id) return;
        const data = { pageNo: 1, pageSize: len };
        data[field] = id;
        request({ url: listApi, data }).then(res => {
            const { list, pageTurn } = res,
                { rowCount } = pageTurn;
            this.setState({
                height: !list.length ? 60 : list.length === 1 ? 200 : 350,
                hasMore: list.length >= rowCount ? false : true,
                commentListBlobs: list,
            })
        }).catch(error => { })
    }

    saveComment = info => { // 保存评论
        const { id, field, onSave, commentApi } = this.props,
            data = { content: info };
        data[field] = id;
        request({ url: commentApi, data }).then(res => {
            Toast.success('评价成功!', 0.7);
            this.getCommentList({ pageNo: 1, commentListBlobs: [] })
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
            this.updateCommentList()
        }).catch(err => { })
    }

    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getCommentList()
    }

    componentWillUnmount() {
        typeIn.unmount();
    }

    render() {
        const { commentListBlobs, height, loading } = this.state;
        return (<TitleContent title='评论'>
            <CustomListView
                style={{ height }}
                sectionBodyClassName={null}
                getListViewInstance={instance => this.listView = instance}
                loading={loading}
                data={commentListBlobs}
                onEndReached={this.onEndReached}
                renderRow={(item, sectionID, index) => {
                    const { userInfo = {} } = item,
                        { avatar, nickName } = userInfo,
                        replyList = item.replyList || [];
                    return <ul className={styles.item}>
                        <li className={styles.item_header}>
                            <div className={styles.item_header_avatar}>{avatar ? <img src={whichImgLink(avatar)} alt='' /> : null}</div>
                            <ul className={styles.item_header_title}>
                                <li>{nickName}</li>
                                <li>{Number(index) + 1}楼 {item.timeString}</li>
                            </ul>
                            <span
                                className={styles.item_header_reply}
                                onClick={e => {
                                    typeIn({
                                        onSend: this.saveCommentReply,
                                        config: { placeholder: "写回复" }
                                    });
                                    this.setState({
                                        replyItemInfo: {
                                            commentId: item.id,
                                            replyUserId: userInfo.id
                                        }
                                    })
                                }}>回复</span>
                        </li>
                        <li className={styles.item_body}>
                            <p className={styles.item_body_content}>{item.content}</p>
                            {replyList.length ? <ul className={styles.item_body_replyList}>
                                {replyList.map(val => <li key={val.id}>
                                    <span className={styles.tip}>{val.user}</span >：<span className={styles.tip}>@{val.replyUser}</span> {val.content}
                                </li>)}
                            </ul> : null}
                        </li>
                    </ul>
                }}
            />
        </TitleContent>)
    }
}