import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Toast, ActivityIndicator } from 'antd-mobile';
import InfoList from '../../../component/infoList';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomCarousel from '../../../component/customCarousel';
import hasTransformFullScreen from '../../../component/fullScreen/hasTransformFullScreen';
import Evaluate from '../../../component/evaluate';
import EvaluateBar from '../../../component/evaluate/bar';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './detail.less';
import { formatDate } from '../../../utlis';

export default hasTransformFullScreen(class caseDetail extends Component {
    state = {
        isLoading: false,
        detail: {}
    }

    static propTypes = {
        updateCurrentItem: PropTypes.func,
    }
    static defaultProps = {
        updateCurrentItem: function () { }
    }

    getDetail = () => { // 获取案例详情
        const { location, updateCurrentItem } = this.props,
            { state = {} } = location,
            { id } = state;
        if (id) {
            this.setState({ isLoading: true })
            request({ url: api.caseDetail, data: { id } }).then(res => {
                this.setState({ detail: res, isLoading: false });
                // 更新查看数
                updateCurrentItem('views', state.index)
            }).catch(err => {
                this.setState({ isLoading: false })
            })
        }
    }

    componentDidMount() {
        this.getDetail()
        document.title = '案例详情'
    }

    onCollect = () => { // 收藏|取消收藏
        const { location } = this.props,
            { state = {} } = location,
            { detail } = this.state,
            { flagLike } = detail,
            status = flagLike === 0 ? 1 : 0;
        request({ url: api.saveCollects, data: { id: state.id, status } }).then(res => {
            Toast.success(res, 0.7)
            const { detail } = this.state;
            if (status === 1) {
                ++detail.collects;
                detail.flagLike = 1;
            } else {
                detail.collects--;
                detail.flagLike = 0;
            }
            this.setState({ detail: { ...detail } })
        }).catch(err => { })
    }

    // onLike = () => { // 点赞
    //     const { detail } = this.state,
    //         { location, updateCurrentItem } = this.props,
    //         { state = {} } = location;
    //     request({ url: api.saveLikes, data: { id: state.id, status: 1 } }).then(res => {
    //         Toast.success(res, 0.7);
    //         detail.likes++;
    //         this.setState({ detail: { ...detail } })
    //         // 更新列表点赞数
    //         updateCurrentItem('likes', state.index)
    //     }).catch(err => { })
    // }

    onSave = () => { // 评价保存后
        this.evaluateBar.hide();
        const { detail } = this.state,
            { location, updateCurrentItem } = this.props,
            { state } = location;
        detail.comments++;
        this.setState({ detail: { ...detail } })
        // 更新列表评价数
        updateCurrentItem('comments', state.index)
    }

    onSend = info => { // 发送评价
        this.evaluate.saveComment(info)
    }

    render() {
        const { detail, isLoading } = this.state,
            { location } = this.props,
            { state = {} } = location,
            { title, effectImageUrlList = [], remark, creator, createTime, content,
                areaName, houseName, priceName, spaceName, styleName,
                collects, comments, flagLike, likes, views,
                // intents
            } = detail;
        return <div className={styles.wrapper}>
            <div className={styles.wrapper_container}>
                <div className={styles.wrapper_container_body}>
                    <CustomCarousel
                        source={effectImageUrlList}
                    />
                    <Card full>
                        <Card.Header
                            title={<div className={styles.wrapper_container_body_title}>
                                <div>{title}</div>
                                <div onClick={this.onCollect} style={{ color: flagLike ? '#FFCC33' : null }}>
                                    <i className='iconfont icon-collect' />
                                    <div>{flagLike ? '取消收藏' : '收藏'}</div>
                                </div>
                            </div>}
                        />
                        <Card.Body>
                            <div className={styles.wrapper_container_body_info}>
                                <div className={styles.wrapper_container_body_info_des}>
                                    <ul>
                                        <li>{creator}</li>
                                        <li>{createTime ? formatDate(new Date(createTime), 'YY-MM-DD') : null}</li>
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
                    <Evaluate
                        ref={instance => this.evaluate = instance}
                        listApi={api.pageCommentList}
                        replyApi={api.saveCommentReply}
                        commentApi={api.saveComment}
                        id={state.id}
                        field='caseId'
                        onSave={this.onSave}
                    />
                </div>
                <EvaluateBar
                    ref={instance => this.evaluateBar = instance}
                    detail={{ collects, comments, likes, views }}
                    // onLike={this.onLike}
                    onSend={this.onSend}
                />
            </div>
            <ActivityIndicator toast={isLoading} className={styles.wrapper_loading} />
        </div>
    }
})