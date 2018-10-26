import React, { Component } from 'react';
import { Card, InputItem, Toast, ListView } from 'antd-mobile';
import InfoList from '../../../component/infoList';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import NoResult from '../../../component/noResult';
import DetailCarousel from '../common/detailCarousel';
import fullScreen from '../../../component/fullScreen';
import { request } from '../../../request';
import api from '../../../request/api';
import { imgAddress } from '../../../request/baseURL';
import styles from './detail.less';
import { formatDate } from '../../../utlis';

export default fullScreen(class caseDetail extends Component {
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

        detail: {},
    }

    getCommentList = () => { // 获取评论列表
        const { pageNo, pageSize, commentListBlobs, commentListSource } = this.state, { location } = this.props, { state } = location;
        this.setState({ isLoading: true })
        request({ url: api.pageCommentList, data: { caseId: state.id, pageNo, pageSize } }).then(res => {
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

    saveComment = () => { // 保存评论
        const { location } = this.props, { state } = location;
        request({ url: api.saveComment, data: { caseId: state.id, content: 'xxxxxxxxxxxxx' } }).then(res => {
            // console.log(res)
        }).catch(err => { })
    }

    saveCommentReply = ({ commentId, replyUserId, content, index, replyUser }) => { // 保存评论回复
        request({ url: api.saveCommentReply, data: { commentId, replyUserId, content } }).then(res => {
            Toast.success('回复成功!', 0.7);
            const { commentListBlobs, commentListSource } = this.state,
                now = new Date().getTime(),
                currentRow = commentListBlobs[index],
                { replyList } = currentRow;
            currentRow.replyList = replyList ? [...replyList, { id: now, replyUser, user: '管理员', content }] : [{ id: now, replyUser, user: '管理员', content }]
            this.setState({
                commentListSource: commentListSource.cloneWithRows(JSON.parse(JSON.stringify(commentListBlobs)))
            })
        }).catch(err => { })
    }

    getDetail = id => { // 获取案例详情
        request({ url: api.caseDetail, data: { id } }).then(res => {
            this.setState({ detail: res })
        }).catch(err => { })
    }

    componentDidMount() {
        const { location } = this.props, { state } = location;
        this.getDetail(state.id)
        this.getCommentList()
        // this.saveComment()
    }

    collect = (id, status) => { // 收藏|取消收藏
        request({ url: api.saveCollects, data: { id, status } }).then(res => {
            Toast.success(res, 0.7)
            this.getDetail(id)
        }).catch(err => { })
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getCommentList()
    }

    render() {
        const { detail, commentListBlobs, commentListSource, height } = this.state,
            { location } = this.props,
            { state } = location,
            { title, effectImageUrlList = [], remark, creator, createTime, content,
                areaName, houseName, priceName, spaceName, styleName,
                collects, comments, flagLike, likes, views,
                // intents
            } = detail;
        return <div>
            <DetailCarousel
                source={effectImageUrlList.map(item => imgAddress + item)}
            />
            <Card full>
                <Card.Header
                    title={<div className={styles.title}>
                        <div>{title}</div>
                        <div onClick={this.collect.bind(this, state.id, flagLike === 1 ? 0 : 1)} style={{ color: flagLike ? '#FFCC33' : null }}>
                            <i className='iconfont icon-collect' />
                            <div>{flagLike ? '取消收藏' : '收藏'}</div>
                        </div>
                    </div>}
                />
                <Card.Body>
                    <div className='textFontSizeC'>
                        <div className={styles.des}>
                            <ul>
                                <li>{creator}</li>
                                <li>{formatDate(new Date(createTime), 'YY-MM-DD')}</li>
                            </ul>
                            <div>{remark}</div>
                        </div>
                        <InfoList data={[
                            { label: '面积', value: areaName, span: 12 },
                            { label: '户型', value: houseName, span: 12 },
                            { label: '价位', value: priceName, span: 12 },
                            { label: '空间名称', value: spaceName, span: 12 },
                            { label: '风格', value: styleName, span: 12 },
                            // { label: '楼盘', value: <span>成都天语小区 <a href='/x'>同楼盘方案</a></span>, },
                        ]} />
                    </div>
                </Card.Body>
            </Card>
            <CustomWhiteSpace />
            <Card full>
                <Card.Header
                    title="详情"
                />
                <Card.Body>
                    <div dangerouslySetInnerHTML={{ __html: content }} style={{ overflow: 'auto' }} />
                </Card.Body>
            </Card>
            <CustomWhiteSpace />
            <Card full>
                <Card.Header
                    title="评价"
                />
                <Card.Body >
                    <ListView
                        dataSource={commentListSource}
                        renderHeader={() => commentListBlobs.length ? null : <NoResult />}
                        renderRow={(item, sectionID, index) => {
                            const { userInfo } = item,
                                { avatar, nickName } = userInfo,
                                replyList = item.replyList || [];
                            return <Card key={item.id} full>
                                <Card.Header
                                    className={styles.comment_list_header}
                                    title={<ul>
                                        <li className='normalFontSizeC'>{nickName}</li>
                                        <li className='textFontSizeC shallowGreyColor'>{Number(index) + 1}楼 {item.timeString}</li>
                                    </ul>}
                                    thumb={<div className={styles.user_avatar}>{avatar ? <img src={imgAddress + avatar} alt='' /> : null}</div>}
                                    extra={<span className='normalFontSizeC' onClick={e => { this.saveCommentReply({ commentId: item.id, replyUserId: userInfo.id, content: '有帮助就好', index, replyUser: userInfo.nickName }) }}>回复</span>}
                                />
                                <Card.Body>
                                    <ul className='normalFontSizeC'>
                                        <li>{item.content}</li>
                                        <li className={styles.comment_reply_list}>
                                            <ul>
                                                {replyList.map(val => <li key={val.id}>
                                                    <span>{val.user}</span>：<span>@{val.replyUser}</span> {val.content}
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
                </Card.Body>
            </Card>
            <div className={styles.comment}>
                <form action='#' onSubmit={e => { e.preventDefault();console.dir(e.target.pj.value) }}>
                    <InputItem
                        className={styles.comment_input}
                        type="text"
                        placeholder="不写点什么?"
                        name='pj'
                        clear
                    // error={this.state.hasError}
                    // onErrorClick={this.onErrorClick}
                    // onChange={this.onChange}
                    // value={this.state.value}
                    />
                </form>
                <ul className='normalFontSizeC'>
                    <li><i className='iconfont icon-chakan' />{views}</li>
                    <li><i className='iconfont icon-collect' />{collects}</li>
                    <li><i className='iconfont icon-i-good' />{likes}</li>
                    <li><i className='iconfont icon-xiaoxi' />{comments}</li>
                </ul>
            </div>
        </div>
    }
})