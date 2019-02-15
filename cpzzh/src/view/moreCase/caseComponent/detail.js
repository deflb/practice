import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Card, Toast } from 'antd-mobile';
import wx from 'weixin-js-sdk';
import wxConfig from '../../../utlis/wxConfig';
import whichImgLink from '../../../utlis/whichImgLink';
import { wholeUrl } from '../../../utlis';
import InfoList from '../../../component/infoList';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomCarousel from '../../../component/customCarousel';
// import hasTransformFullScreen from '../../../component/fullScreen/hasTransformFullScreen';
import Evaluate from '../../../component/evaluate';
import EvaluateBar from '../../../component/evaluate/bar';
import { request } from '../../../request';
import api from '../../../request/api';
import { getLocationSearch } from '../../../utlis';
import styles from './detail.less';

export default class caseDetail extends Component {
    state = {
        isLoading: false,
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

    getDetail = () => { // 获取案例详情
        const { updateCurrentItem } = this.props;
        if (this.id) {
            this.setState({ isLoading: true })
            request({ url: api.caseDetail, data: { id: this.id } }).then(res => {
                const { location } = this.props, { pathname } = location;
                wxConfig({ wx, jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData'] }).then(() => {
                    wx.updateTimelineShareData({
                        title: '案例详情',
                        link: wholeUrl(pathname + `?id=${res.id}`),
                        imgUrl: whichImgLink(res.surfacePlotUrl)
                    })
                    wx.updateAppMessageShareData({
                        title: '案例详情',
                        desc: res.title,
                        link: wholeUrl(pathname + `?id=${res.id}`),
                        imgUrl: whichImgLink(res.surfacePlotUrl)
                    })
                })
                this.setState({ detail: res, isLoading: false });
                // 更新查看数
                updateCurrentItem('views', this.index)
            }).catch(err => {
                this.setState({ isLoading: false })
            })
        }
    }

    componentWillMount() {
        document.title = '案例详情';
        const { location } = this.props,
            { state = {} } = location,
            { id, index } = state;
        this.id = id || getLocationSearch('id');
        this.index = index;
        this.getDetail()
    }

    onCollect = () => { // 收藏|取消收藏
        const { collectBack } = this.props,
            { detail } = this.state,
            { flagLike } = detail,
            status = flagLike ? 0 : 1;
        if (this.id)
            request({ url: api.saveCollects, data: { id: this.id, status } }).then(res => {
                Toast.success(res, 0.7);
                if (status === 1) {
                    ++detail.collects;
                    detail.flagLike = 1;
                } else {
                    detail.collects--;
                    detail.flagLike = 0;
                }
                collectBack();
                this.setState({ detail: { ...detail } })
            }).catch(err => { })
    }

    onLike = () => { // 点赞
        const { detail } = this.state,
            { updateCurrentItem } = this.props;
        if (this.id)
            request({ url: api.saveLikes, data: { id: this.id, status: 1 } }).then(res => {
                Toast.success(res, 0.7);
                detail.likes++;
                this.setState({ detail: { ...detail } })
                // 更新列表点赞数
                updateCurrentItem('likes', this.index)
            }).catch(err => { })
    }

    onSave = () => { // 评价保存后
        const { detail } = this.state,
            { updateCurrentItem } = this.props;
        detail.comments++;
        this.setState({ detail: { ...detail } })
        // 更新列表评价数
        updateCurrentItem('comments', this.index)
    }

    onSend = info => { // 发送评价
        this.evaluate.saveComment(info)
    }

    onComment = () => {
        ReactDOM.findDOMNode(this.evaluate).scrollIntoView()
    }

    render() {
        const { detail } = this.state,
            { title, effectImageUrlList = [], remark, content,
                areaName, houseName, priceName, spaceName, styleName,
                collects, comments, flagLike, likes, views,
                // intents
            } = detail;
        return (<React.Fragment>
            <div className={styles.content}>
                <CustomCarousel
                    source={effectImageUrlList}
                />
                <Card full>
                    <Card.Header title={<div className={styles.title}>{title}</div>} />
                    <Card.Body>
                        <div className={styles.info}>
                            <p className={styles.info_des}>{remark}</p>
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
                        <div dangerouslySetInnerHTML={{ __html: content }} className='rich_text_global' />
                    </Card.Body>
                </Card>
                <CustomWhiteSpace />
                <Evaluate
                    ref={instance => this.evaluate = instance}
                    listApi={api.pageCommentList}
                    replyApi={api.saveCommentReply}
                    commentApi={api.saveComment}
                    id={this.id}
                    field='caseId'
                    onSave={this.onSave}
                />
            </div>
            <EvaluateBar
                detail={{ collects, comments, likes, views, collected: flagLike }}
                onLike={this.onLike}
                onSend={this.onSend}
                onCollect={this.onCollect}
                onComment={this.onComment}
            />
        </React.Fragment>)
    }
}