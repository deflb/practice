import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Card, Toast } from 'antd-mobile';
// import hasTransformFullScreen from '../../../component/fullScreen/hasTransformFullScreen';
// import EnabledIosScrollView from '../../../component/enabledIosScrollView';
// import CustomCarousel from '../../../component/customCarousel';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import Evaluate from '../../../component/evaluate';
import EvaluateBar from '../../../component/evaluate/bar';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './index.less';
import whichImgLink from '../../../utlis/whichImgLink';
import { getLocationSearch, wholeUrl } from '../../../utlis';
import wx from 'weixin-js-sdk';
import wxConfig from '../../../utlis/wxConfig';
import routerBase from '../../../router/routerBase';

export default class detail extends Component {
    state = {
        detail: {}
    }

    static propTypes = {
        updateCurrentItem: PropTypes.func,
        collectBack: PropTypes.func,
    }
    static defaultProps = {
        updateCurrentItem: function () { },
        collectBack: function () { },
    }

    componentWillMount() {
        document.title = '晒家详情';
        const { location } = this.props,
            { state = {} } = location,
            { id, index } = state;
        this.id = id || getLocationSearch('id');
        this.index = index;
        this.getDetail();
    }
    getDetail = () => {
        const { updateCurrentItem } = this.props;
        if (this.id)
            request({ url: api.HouseShowDetail, data: { id: this.id } }).then(res => {
                const { location } = this.props, { pathname } = location;
                wxConfig({ wx, jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData'] }).then(() => {
                    wx.updateTimelineShareData({
                        title: '晒家详情',
                        link: wholeUrl(pathname + `?id=${res.id}`),
                        imgUrl: whichImgLink(res.cover)
                    })
                    wx.updateAppMessageShareData({
                        title: '晒家详情',
                        desc: res.title,
                        link: wholeUrl(pathname + `?id=${res.id}`),
                        imgUrl: whichImgLink(res.cover)
                    })
                })
                this.setState({ detail: res });
                request({ url: api.addViewCount, data: { id: this.id } }).then(res => {
                    updateCurrentItem('viewCount', this.index)
                }).catch(err => { })
            }).catch(err => { })
    }
    onLike = () => { // 点赞
        const { detail } = this.state,
            { updateCurrentItem } = this.props;
        if (this.id)
            request({ url: api.houseShowLike, data: { id: this.id } }).then(res => {
                Toast.success('操作成功', 0.7);
                if (!detail.isLike) {
                    detail.isLike = 1;
                    detail.likeCount++;
                } else {
                    detail.isLike = 0;
                    detail.likeCount--;
                }
                this.setState({ detail: { ...detail } })
                // 更新列表点赞数
                updateCurrentItem('likeCount', this.index)
            }).catch(err => { })
    }
    onSave = () => { // 评价保存后
        const { updateCurrentItem } = this.props;
        // 更新列表评价数
        updateCurrentItem('commentCount', this.index)
    }
    onSend = info => { // 发送评价
        this.evaluate.saveComment(info)
    }
    edit = (data) => { // 去编辑
        let { history } = this.props;
        history.push({
            pathname: routerBase + '/editShowHome',
            state: data
        })
    }
    onCollect = () => { // 收藏|取消收藏
        const { collectBack } = this.props,
            { detail } = this.state,
            { isCollect } = detail;
        if (this.id)
            request({ url: api.houseShowCollect, data: { id: this.id } }).then(res => {
                Toast.success('操作成功', 0.7)
                if (!isCollect) {
                    ++detail.collectCount;
                    detail.isCollect = 1;
                } else {
                    detail.collectCount--;
                    detail.isCollect = 0;
                }
                collectBack();
                this.setState({ detail: { ...detail } })
            }).catch(err => { })
    }
    onComment = () => {
        ReactDOM.findDOMNode(this.evaluate).scrollIntoView()
    }
    render() {
        const { detail } = this.state,
            { location } = this.props,
            { state = {} } = location,
            { auditStatus } = state,
            { title, building, creatorName, creatorAvatar, content,
                viewCount, isCollect, collectCount, isLike, likeCount, commentCount
            } = detail;
        return (<React.Fragment>
            <div className={styles.content}>
                {/* <CustomCarousel
                    source={[]}
                /> */}
                <Card full>
                    <Card.Header
                        title={<div className={styles.title}>{title}</div>}
                    />
                    <Card.Body>
                        <ul className={styles.info}>
                            <li className={styles.info_user}>
                                <div className={styles.info_user_avator}>
                                    {creatorAvatar ? <img src={whichImgLink(creatorAvatar)} alt='' /> : null}
                                </div>
                                <ul className={styles.info_user_info}>
                                    <li className={styles.info_user_info_name}>{creatorName}</li>
                                    <li className={styles.info_user_info_address}><i className='iconfont icon-address' />{building}</li>
                                </ul>
                            </li>
                        </ul>
                    </Card.Body>
                </Card>
                <CustomWhiteSpace />
                <Card full>
                    <Card.Header
                        title="详情"
                    />
                    <Card.Body>
                        <div dangerouslySetInnerHTML={{ __html: content }} className='rich_text_global' />
                    </Card.Body>
                </Card>
                <CustomWhiteSpace />
                {(!auditStatus && auditStatus !== 0) || auditStatus === 1 ? <Evaluate
                    ref={instance => this.evaluate = instance}
                    listApi={api.pageHsCommentList}
                    replyApi={api.saveHsCommentReply}
                    commentApi={api.saveHsComment}
                    id={this.id}
                    field='houseShowId'
                    onSave={this.onSave}
                /> : null}
            </div>
            {(!auditStatus && auditStatus !== 0) || auditStatus === 1 ? <EvaluateBar
                detail={{ collects: collectCount, collected: isCollect, comments: commentCount, liked: isLike, likes: likeCount, views: viewCount }}
                onLike={this.onLike}
                onSend={this.onSend}
                onCollect={this.onCollect}
                onComment={this.onComment}
            /> : null}
            {auditStatus === 0 || auditStatus === 2 ? <div className={styles.edit} onClick={this.edit.bind(this, { ...detail, auditStatus })}>编辑</div> : null}
        </React.Fragment>)
    }
}